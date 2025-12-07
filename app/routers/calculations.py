from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.calculation import Calculation
from app.schemas.calculation import CalculationCreate, CalculationUpdate, CalculationResponse
from app.auth import get_current_user

router = APIRouter(prefix="/calculations", tags=["calculations"])

def perform_calculation(operation: str, operand1: float, operand2: float) -> float:
    """Perform the calculation based on operation type"""
    if operation == "add":
        return operand1 + operand2
    elif operation == "subtract":
        return operand1 - operand2
    elif operation == "multiply":
        return operand1 * operand2
    elif operation == "divide":
        if operand2 == 0:
            raise ValueError("Cannot divide by zero")
        return operand1 / operand2
    else:
        raise ValueError(f"Invalid operation: {operation}")

# Browse - Get all calculations for current user
@router.get("", response_model=List[CalculationResponse])
def get_calculations(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    calculations = db.query(Calculation).filter(
        Calculation.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return calculations

# Read - Get a specific calculation by ID
@router.get("/{calculation_id}", response_model=CalculationResponse)
def get_calculation(
    calculation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    calculation = db.query(Calculation).filter(
        Calculation.id == calculation_id,
        Calculation.user_id == current_user.id
    ).first()
    
    if not calculation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Calculation not found"
        )
    return calculation

# Add - Create a new calculation
@router.post("", response_model=CalculationResponse, status_code=status.HTTP_201_CREATED)
def create_calculation(
    calculation: CalculationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = perform_calculation(
            calculation.operation,
            calculation.operand1,
            calculation.operand2
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    db_calculation = Calculation(
        user_id=current_user.id,
        operation=calculation.operation,
        operand1=calculation.operand1,
        operand2=calculation.operand2,
        result=result
    )
    db.add(db_calculation)
    db.commit()
    db.refresh(db_calculation)
    return db_calculation

# Edit - Update an existing calculation
@router.put("/{calculation_id}", response_model=CalculationResponse)
def update_calculation(
    calculation_id: int,
    calculation_update: CalculationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_calculation = db.query(Calculation).filter(
        Calculation.id == calculation_id,
        Calculation.user_id == current_user.id
    ).first()
    
    if not db_calculation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Calculation not found"
        )
    
    # Update fields if provided
    if calculation_update.operation is not None:
        db_calculation.operation = calculation_update.operation
    if calculation_update.operand1 is not None:
        db_calculation.operand1 = calculation_update.operand1
    if calculation_update.operand2 is not None:
        db_calculation.operand2 = calculation_update.operand2
    
    # Recalculate result
    try:
        db_calculation.result = perform_calculation(
            db_calculation.operation,
            db_calculation.operand1,
            db_calculation.operand2
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    db.commit()
    db.refresh(db_calculation)
    return db_calculation

# Delete - Remove a calculation
@router.delete("/{calculation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_calculation(
    calculation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_calculation = db.query(Calculation).filter(
        Calculation.id == calculation_id,
        Calculation.user_id == current_user.id
    ).first()
    
    if not db_calculation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Calculation not found"
        )
    
    db.delete(db_calculation)
    db.commit()
    return None
