import os
import json
import requests
from app.utils.logger import logger
from app.config import OPENAI_API_KEY


def generate_llm_quiz(
        text: str,
        num_mcq: int = 4,
        num_tf: int = 3,
        num_scenario: int = 2
) -> dict:
    """
    Generate a mixed quiz using OpenAI GPT.
    Raises ValueError if OPENAI_API_KEY is not set.
    """
    if not OPENAI_API_KEY:
        raise ValueError(
            "OPENAI_API_KEY is not configured in environment variables."
        )

    prompt = f"""
You are a pharmaceutical SOP training expert.
Generate a quiz from the SOP content below.

Requirements:
- {num_mcq} MCQ questions (4 options A/B/C/D, one correct answer)
- {num_tf} True/False questions  
- {num_scenario} practical scenario-based questions
- Difficulty: beginner to intermediate
- Focus on: compliance, safety, correct procedure, temperature handling

Return ONLY valid JSON — no markdown fences, no extra text:
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
      "question_no": 5,
      "question": "True or False: ...",
      "options": {{"A": "True", "B": "False", "C": "Not applicable", "D": "Depends on context"}},
      "correct_answer": "A",
      "explanation": "..."
    }}
  ],
  "scenario": [
    {{
      "question_no": 8,
      "question": "Scenario: [situation]. What should the staff member do?",
      "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
      "correct_answer": "C",
      "explanation": "..."
    }}
  ]
}}

SOP Content (first 3000 chars):
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
                "max_tokens": 2500
            },
            timeout=30
        )
        response.raise_for_status()

        raw = response.json()["choices"][0]["message"]["content"]
        # Strip markdown code fences if present
        clean = raw.strip()
        clean = clean.removeprefix("```json").removeprefix("```").removesuffix("```").strip()

        quiz_data = json.loads(clean)
        logger.info("LLM quiz generated successfully.")
        return quiz_data

    except json.JSONDecodeError as e:
        logger.error(f"LLM returned invalid JSON: {e}")
        raise ValueError(f"LLM response was not valid JSON: {e}")
    except requests.RequestException as e:
        logger.error(f"OpenAI API request failed: {e}")
        raise ValueError(f"OpenAI API error: {e}")
    except Exception as e:
        logger.error(f"LLM quiz generation failed: {e}")
        raise