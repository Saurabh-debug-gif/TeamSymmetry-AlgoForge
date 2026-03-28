import os
import json
import requests
from app.utils.logger import logger

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


def generate_llm_quiz(text: str, num_mcq: int = 2, num_tf: int = 2, num_scenario: int = 1) -> dict:
    """
    Use LLM to generate mixed quiz: MCQ + True/False + Scenario questions.
    Falls back gracefully if API key not set.
    """
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY not set in environment.")

    prompt = f"""
You are a pharmaceutical SOP training expert.
Generate a quiz from the SOP content below.

Requirements:
- {num_mcq} MCQ questions (4 options each, one correct)
- {num_tf} True/False questions
- {num_scenario} practical scenario question
- Difficulty: beginner to intermediate
- Focus on compliance, safety, and procedure accuracy

Return ONLY valid JSON in this exact format:
{{
  "mcq": [
    {{
      "question_no": 1,
      "question": "...",
      "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
      "correct_answer": "B",
      "explanation": "..."
    }}
  ],
  "true_false": [
    {{
      "question_no": 3,
      "question": "...",
      "correct_answer": true,
      "explanation": "..."
    }}
  ],
  "scenario": [
    {{
      "question_no": 5,
      "situation": "...",
      "question": "What should the staff member do?",
      "correct_action": "...",
      "explanation": "..."
    }}
  ]
}}

SOP Content:
{text[:3000]}
"""

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.4,
                "max_tokens": 2000
            }
        )
        response.raise_for_status()
        raw = response.json()["choices"][0]["message"]["content"]

        # Strip markdown fences if present
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        quiz_data = json.loads(clean)

        logger.info("LLM quiz generated successfully.")
        return quiz_data

    except json.JSONDecodeError as e:
        logger.error(f"LLM returned invalid JSON: {e}")
        raise ValueError("LLM response was not valid JSON.")
    except Exception as e:
        logger.error(f"LLM quiz generation failed: {e}")
        raise