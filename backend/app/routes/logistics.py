"""
AgriConnect AI - Logistics & Route Optimization FastAPI Route
POST /api/logistics/optimize-route
"""

from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.logistics import RouteOptimizeRequest, RouteOptimizeResponse
from backend.app.services.route_optimizer import optimize_route

router = APIRouter(prefix="/api/logistics", tags=["Logistics"])

@router.post(
    "/optimize-route",
    response_model=RouteOptimizeResponse,
    summary="Calculate optimized delivery sequence for multiple orders",
    status_code=status.HTTP_200_OK
)
def api_optimize_route(req: RouteOptimizeRequest):
    """
    Computes optimal multi-stop vehicle delivery route using Google OR-Tools / VRP solver.
    Validates starting location, customer coordinates, and vehicle capacity.
    """
    try:
        payload = req.dict()
        result = optimize_route(payload)
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Route calculation failure: {str(e)}"
        )
