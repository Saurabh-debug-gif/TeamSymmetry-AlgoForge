from pydantic import BaseModel
from typing import List


class TrainingContent(BaseModel):
    basic_paragraph: str
    bullet_learning: List[str]
    critical_alerts: List[str]
    quick_summary: str


class QuizItem(BaseModel):
    question: str
    answer: str


class SOPResponse(BaseModel):
    training_content: TrainingContent
    quiz: List[QuizItem]