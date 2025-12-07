from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Literal

class CalculationBase(BaseModel):
    operation: Literal["add", "subtract", "multiply", "divide"]
    operand1: float
    operand2: float

class CalculationCreate(CalculationBase):
    @field_validator('operand2')
    @classmethod
    def validate_division(cls, v, info):
        if info.data.get('operation') == 'divide' and v == 0:
            raise ValueError('Cannot divide by zero')
        return v

class CalculationUpdate(BaseModel):
    operation: Literal["add", "subtract", "multiply", "divide"] | None = None
    operand1: float | None = None
    operand2: float | None = None

class CalculationResponse(CalculationBase):
    id: int
    user_id: int
    result: float
    created_at: datetime

    class Config:
        from_attributes = True
