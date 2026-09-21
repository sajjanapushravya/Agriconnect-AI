"""
AgriConnect AI - Route Optimizer Service
Powered by Google OR-Tools (Vehicle Routing Problem)
Computes practical delivery sequences for multi-order farm logistics with vehicle capacity constraints.
"""

import sys
import json
import math
from typing import List, Dict, Any, Tuple, Optional

# Attempt to import Google OR-Tools
ORTOOLS_AVAILABLE = False
try:
    from ortools.constraint_solver import routing_enums_pb2
    from ortools.constraint_solver import pywrapcp
    ORTOOLS_AVAILABLE = True
except ImportError:
    ORTOOLS_AVAILABLE = False


def calculate_haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Haversine formula to compute great-circle distance between two GPS coordinates.
    Applies a 1.28x road network tortuosity factor to simulate realistic road geometry.
    """
    R = 6371.0  # Earth's radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    road_tortuosity_factor = 1.28
    return round(R * c * road_tortuosity_factor, 2)


def create_distance_matrix(locations: List[Tuple[float, float]]) -> List[List[int]]:
    """
    Builds an integer distance matrix in meters (as required by OR-Tools integer solver).
    """
    matrix = []
    for i, (lat1, lon1) in enumerate(locations):
        row = []
        for j, (lat2, lon2) in enumerate(locations):
            if i == j:
                row.append(0)
            else:
                dist_km = calculate_haversine_distance_km(lat1, lon1, lat2, lon2)
                row.append(int(dist_km * 1000))  # in meters
        matrix.append(row)
    return matrix


def solve_with_ortools(
    start_loc: Dict[str, Any],
    orders: List[Dict[str, Any]],
    vehicle_capacity: float
) -> Dict[str, Any]:
    """
    Solves the Capacitated Vehicle Routing Problem (CVRP) using Google OR-Tools.
    """
    locations = [(start_loc["latitude"], start_loc["longitude"])]
    demands = [0]  # Depot has 0 demand
    for order in orders:
        locations.append((order["latitude"], order["longitude"]))
        demands.append(int(round(order.get("quantity", 0.0))))

    num_locations = len(locations)
    distance_matrix = create_distance_matrix(locations)

    # 1. Create Routing Index Manager (Locations, 1 Vehicle, Depot is Node 0)
    manager = pywrapcp.RoutingIndexManager(num_locations, 1, 0)

    # 2. Create Routing Model
    routing = pywrapcp.RoutingModel(manager)

    # 3. Define transit distance callback
    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return distance_matrix[from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # 4. Define capacity demand callback & dimension
    def demand_callback(from_index):
        from_node = manager.IndexToNode(from_index)
        return demands[from_node]

    demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index,
        0,  # null capacity slack
        [int(round(vehicle_capacity))],  # vehicle maximum capacities
        True,  # start cumul to zero
        "Capacity"
    )

    # 5. Configure search parameters
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    search_parameters.time_limit.FromSeconds(1)

    # 6. Solve the problem
    solution = routing.SolveWithParameters(search_parameters)

    if not solution:
        raise RuntimeError("OR-Tools failed to find a valid route within the vehicle capacity constraint.")

    # 7. Extract the optimized route sequence
    index = routing.Start(0)
    route_nodes = []
    total_distance_meters = 0

    while not routing.IsEnd(index):
        node = manager.IndexToNode(index)
        previous_index = index
        index = solution.Value(routing.NextVar(index))
        if not routing.IsEnd(index):
            next_node = manager.IndexToNode(index)
            total_distance_meters += distance_matrix[node][next_node]
            route_nodes.append(next_node)

    return build_route_response(
        start_loc=start_loc,
        orders=orders,
        route_nodes=route_nodes,
        total_distance_meters=total_distance_meters,
        vehicle_capacity=vehicle_capacity,
        algorithm="Google OR-Tools VRP"
    )


def solve_with_heuristic_fallback(
    start_loc: Dict[str, Any],
    orders: List[Dict[str, Any]],
    vehicle_capacity: float
) -> Dict[str, Any]:
    """
    Standard Nearest-Neighbor + 2-Opt local search solver when OR-Tools is not yet installed.
    Provides mathematically sound sequence ordering without breaking runtime.
    """
    n = len(orders)
    # Start at depot
    unvisited = list(range(n))
    route_indices = []
    current_lat = start_loc["latitude"]
    current_lng = start_loc["longitude"]

    # Nearest neighbor pass
    while unvisited:
        best_idx = -1
        min_dist = float("inf")
        for i in unvisited:
            d = calculate_haversine_distance_km(
                current_lat, current_lng,
                orders[i]["latitude"], orders[i]["longitude"]
            )
            if d < min_dist:
                min_dist = d
                best_idx = i
        unvisited.remove(best_idx)
        route_indices.append(best_idx)
        current_lat = orders[best_idx]["latitude"]
        current_lng = orders[best_idx]["longitude"]

    # 2-Opt optimization pass
    improved = True
    iterations = 0
    while improved and iterations < 20:
        improved = False
        iterations += 1
        for i in range(len(route_indices) - 1):
            for k in range(i + 1, len(route_indices)):
                # Calculate cost change
                p1 = start_loc if i == 0 else orders[route_indices[i - 1]]
                p2 = orders[route_indices[i]]
                p3 = orders[route_indices[k]]
                p4 = start_loc if k == len(route_indices) - 1 else orders[route_indices[k + 1]]

                d_old = (calculate_haversine_distance_km(p1["latitude"], p1["longitude"], p2["latitude"], p2["longitude"]) +
                         calculate_haversine_distance_km(p3["latitude"], p3["longitude"], p4["latitude"], p4["longitude"]))
                d_new = (calculate_haversine_distance_km(p1["latitude"], p1["longitude"], p3["latitude"], p3["longitude"]) +
                         calculate_haversine_distance_km(p2["latitude"], p2["longitude"], p4["latitude"], p4["longitude"]))

                if d_new < d_old - 0.05:
                    route_indices[i:k + 1] = reversed(route_indices[i:k + 1])
                    improved = True

    # Node indices in 1-based format corresponding to order positions
    route_nodes = [idx + 1 for idx in route_indices]

    # Calculate total distance
    total_dist_km = 0.0
    curr_lat, curr_lng = start_loc["latitude"], start_loc["longitude"]
    for node_idx in route_nodes:
        ord_item = orders[node_idx - 1]
        total_dist_km += calculate_haversine_distance_km(curr_lat, curr_lng, ord_item["latitude"], ord_item["longitude"])
        curr_lat, curr_lng = ord_item["latitude"], ord_item["longitude"]

    return build_route_response(
        start_loc=start_loc,
        orders=orders,
        route_nodes=route_nodes,
        total_distance_meters=int(total_dist_km * 1000),
        vehicle_capacity=vehicle_capacity,
        algorithm="Heuristic 2-Opt VRP (Install 'pip install ortools' to enable Google OR-Tools engine)"
    )


def build_route_response(
    start_loc: Dict[str, Any],
    orders: List[Dict[str, Any]],
    route_nodes: List[int],
    total_distance_meters: int,
    vehicle_capacity: float,
    algorithm: str
) -> Dict[str, Any]:
    """
    Constructs the standard response JSON specified in the project requirements.
    """
    total_distance_km = round(total_distance_meters / 1000.0, 1)
    
    # Estimate travel time based on average rural-to-urban transit speed of 32 km/h + 8 mins per delivery stop
    num_stops = len(route_nodes)
    transit_minutes = int(round((total_distance_km / 32.0) * 60.0))
    stop_handling_minutes = num_stops * 8
    estimated_time_minutes = transit_minutes + stop_handling_minutes

    route_stops = []
    total_quantity = 0.0
    prev_lat = start_loc["latitude"]
    prev_lng = start_loc["longitude"]

    # Calculate cumulative arrival time
    current_minutes = 0
    for seq_num, node in enumerate(route_nodes, 1):
        order_idx = node - 1
        order = orders[order_idx]
        qty = float(order.get("quantity", 0.0))
        total_quantity += qty

        leg_dist = calculate_haversine_distance_km(prev_lat, prev_lng, order["latitude"], order["longitude"])
        leg_time = int(round((leg_dist / 32.0) * 60.0)) + 8
        current_minutes += leg_time

        # Format arrival e.g. +45 mins
        hours = current_minutes // 60
        mins = current_minutes % 60
        arrival_str = f"+{hours}h {mins}m" if hours > 0 else f"+{mins} mins"

        route_stops.append({
            "sequence": seq_num,
            "order_id": order.get("order_id"),
            "latitude": order["latitude"],
            "longitude": order["longitude"],
            "buyer_name": order.get("buyer_name", f"Buyer {seq_num}"),
            "buyer_type": order.get("buyer_type", "consumer"),
            "address": order.get("address", "Delivery Point"),
            "quantity": qty,
            "distance_from_prev_km": leg_dist,
            "estimated_arrival_time": arrival_str
        })

        prev_lat = order["latitude"]
        prev_lng = order["longitude"]

    return {
        "route": route_stops,
        "total_distance_km": total_distance_km,
        "estimated_time_minutes": estimated_time_minutes,
        "total_quantity": round(total_quantity, 1),
        "number_of_stops": num_stops,
        "start_location": start_loc,
        "vehicle_capacity": vehicle_capacity,
        "status": "OPTIMIZED",
        "distance_model": "Haversine formula with 1.28x road network tortuosity factor (estimated road distance)",
        "explanation": "Route optimization helps organize deliveries efficiently and may reduce unnecessary travel when compared with an unplanned delivery sequence.",
        "algorithm_used": algorithm
    }


def optimize_route(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point for Route Optimization.
    Validates inputs, validates vehicle capacity, and triggers OR-Tools or heuristic solver.
    """
    # 1. Validate starting location
    start_loc = data.get("start_location")
    if not start_loc or "latitude" not in start_loc or "longitude" not in start_loc:
        raise ValueError("Missing or invalid start location. Please provide latitude and longitude.")

    try:
        start_lat = float(start_loc["latitude"])
        start_lng = float(start_loc["longitude"])
        if not (-90 <= start_lat <= 90 and -180 <= start_lng <= 180):
            raise ValueError()
    except Exception:
        raise ValueError("Invalid coordinates for start location.")

    # 2. Validate orders
    orders = data.get("orders", [])
    if not orders or len(orders) == 0:
        raise ValueError("No active deliveries available.")

    # 3. Validate coordinates and quantities of each order
    total_quantity = 0.0
    for idx, order in enumerate(orders):
        if "latitude" not in order or "longitude" not in order or order.get("latitude") is None or order.get("longitude") is None:
            raise ValueError("Some orders are missing delivery locations.")

        try:
            o_lat = float(order["latitude"])
            o_lng = float(order["longitude"])
            if not (-90 <= o_lat <= 90 and -180 <= o_lng <= 180):
                raise ValueError()
        except Exception:
            raise ValueError(f"Invalid GPS coordinates in order ID: {order.get('order_id', idx + 1)}.")

        qty = float(order.get("quantity", 0.0))
        if qty < 0:
            raise ValueError(f"Invalid quantity {qty} for order ID: {order.get('order_id', idx + 1)}.")
        total_quantity += qty

    # 4. Check vehicle capacity
    vehicle_capacity = float(data.get("vehicle_capacity", 500.0))
    if vehicle_capacity <= 0:
        raise ValueError("Invalid vehicle capacity. Capacity must be greater than 0.")

    if total_quantity > vehicle_capacity:
        raise ValueError("Vehicle capacity exceeded. Please split the delivery into multiple trips/vehicles.")

    # 5. Execute Solver
    if ORTOOLS_AVAILABLE:
        try:
            return solve_with_ortools(start_loc, orders, vehicle_capacity)
        except Exception as e:
            # Fallback if OR-Tools solver encounters internal error
            return solve_with_heuristic_fallback(start_loc, orders, vehicle_capacity)
    else:
        return solve_with_heuristic_fallback(start_loc, orders, vehicle_capacity)


if __name__ == "__main__":
    """
    CLI interface to allow invocation from Node.js / Express backend via stdin or JSON argument.
    """
    try:
        raw_input = None
        if len(sys.argv) > 1:
            raw_input = sys.argv[1]
        elif not sys.stdin.isatty():
            raw_input = sys.stdin.read().strip()

        if not raw_input:
            print(json.dumps({"error": "No input JSON provided"}))
            sys.exit(1)

        payload = json.loads(raw_input)
        result = optimize_route(payload)
        print(json.dumps(result))
        sys.exit(0)
    except ValueError as ve:
        print(json.dumps({"error": str(ve)}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": f"Route calculation failure: {str(e)}"}))
        sys.exit(1)
