from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class Location(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude between -90 and 90")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude between -180 and 180")
    address: Optional[str] = "Farm Depot"

class OrderStopInput(BaseModel):
    order_id: Any = Field(..., description="Unique order identifier (number or string)")
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    quantity: float = Field(..., ge=0.0, description="Order quantity in kg")
    buyer_name: Optional[str] = "Customer"
    buyer_type: Optional[str] = "consumer"
    address: Optional[str] = "Delivery Location"
    priority: Optional[int] = 1

class RouteOptimizeRequest(BaseModel):
    start_location: Location
    vehicle_capacity: float = Field(default=500.0, gt=0, description="Vehicle capacity in kg")
    orders: List[OrderStopInput]

class OptimizedStop(BaseModel):
    sequence: int
    order_id: Any
    latitude: float
    longitude: float
    buyer_name: Optional[str] = None
    buyer_type: Optional[str] = None
    address: Optional[str] = None
    quantity: float
    distance_from_prev_km: float = 0.0
    estimated_arrival_time: Optional[str] = None

class RouteOptimizeResponse(BaseModel):
    route: List[OptimizedStop]
    total_distance_km: float
    estimated_time_minutes: int
    total_quantity: float
    number_of_stops: int
    start_location: Location
    vehicle_capacity: float
    status: str = "OPTIMIZED"
    distance_model: str = "Haversine formula with 1.28x road network tortuosity factor (estimated road distance)"
    explanation: str = "Route optimization helps organize deliveries efficiently and may reduce unnecessary travel when compared with an unplanned delivery sequence."
    algorithm_used: str = "Google OR-Tools VRP"
