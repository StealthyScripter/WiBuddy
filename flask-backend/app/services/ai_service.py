import os
from typing import List, Dict, Optional
import json

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False


class AIService:
    """Service for AI-powered learning features using OpenAI or Anthropic Claude"""

    def __init__(self):
        self.provider = os.getenv('AI_PROVIDER', 'openai').lower()

        if self.provider == 'openai' and OPENAI_AVAILABLE:
            self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            self.model = os.getenv('OPENAI_MODEL', 'gpt-4-turbo-preview')
        elif self.provider == 'anthropic' and ANTHROPIC_AVAILABLE:
            self.client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
            self.model = os.getenv('ANTHROPIC_MODEL', 'claude-3-5-sonnet-20241022')
        else:
            self.client = None
            self.model = None

    def _call_ai(self, system_prompt: str, user_prompt: str, temperature: float = 0.7, max_tokens: int = 2000) -> str:
        """Internal method to call AI provider"""
        if not self.client:
            raise Exception(f"AI provider '{self.provider}' not configured or library not installed")

        try:
            if self.provider == 'openai':
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=temperature,
                    max_tokens=max_tokens
                )
                return response.choices[0].message.content

            elif self.provider == 'anthropic':
                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    system=system_prompt,
                    messages=[
                        {"role": "user", "content": user_prompt}
                    ]
                )
                return response.content[0].text

        except Exception as e:
            raise Exception(f"AI API error: {str(e)}")

    def generate_summary(self, content: str, content_type: str = "note", max_length: int = 200) -> str:
        """Generate a concise summary of learning content"""
        system_prompt = f"""You are an expert educational content summarizer.
        Create clear, concise summaries that capture key concepts and main ideas.
        Keep summaries under {max_length} words."""

        user_prompt = f"""Summarize the following {content_type} content in a clear and concise way:

{content}

Provide a summary that captures the main ideas and key concepts."""

        return self._call_ai(system_prompt, user_prompt, temperature=0.5, max_tokens=500)

    def generate_flashcards(self, content: str, num_cards: int = 10, difficulty: str = "MEDIUM") -> List[Dict]:
        """Generate flashcards from learning content"""
        system_prompt = """You are an expert at creating effective flashcards for studying.
        Create clear, focused flashcards with concise questions and answers.
        Each flashcard should test a single concept."""

        user_prompt = f"""Create {num_cards} flashcards at {difficulty} difficulty level from this content:

{content}

Return the response as a JSON array with this exact structure:
[
  {{
    "front": "Question or prompt",
    "back": "Answer or explanation",
    "difficulty": "{difficulty}",
    "tags": ["tag1", "tag2"]
  }}
]

Only return the JSON array, no additional text."""

        response = self._call_ai(system_prompt, user_prompt, temperature=0.7, max_tokens=2000)

        try:
            # Parse JSON response
            flashcards = json.loads(response)
            return flashcards
        except json.JSONDecodeError:
            # If AI doesn't return valid JSON, create a simple structure
            return [{
                "front": "Summary",
                "back": response,
                "difficulty": difficulty,
                "tags": []
            }]

    def generate_questions(self, content: str, num_questions: int = 5,
                          question_types: List[str] = None) -> List[Dict]:
        """Generate quiz questions from learning content"""
        if question_types is None:
            question_types = ["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]

        system_prompt = """You are an expert at creating educational assessment questions.
        Create clear, well-structured questions that test understanding of key concepts."""

        user_prompt = f"""Create {num_questions} questions from this content.
        Use these question types: {', '.join(question_types)}

Content:
{content}

Return as JSON array with this structure:
[
  {{
    "question": "Question text",
    "type": "MULTIPLE_CHOICE or TRUE_FALSE or SHORT_ANSWER",
    "options": ["A", "B", "C", "D"] (only for MULTIPLE_CHOICE),
    "correct_answer": "Correct answer",
    "explanation": "Why this is correct",
    "difficulty": "LOW, MEDIUM, or HIGH",
    "tags": ["concept1", "concept2"]
  }}
]

Only return the JSON array."""

        response = self._call_ai(system_prompt, user_prompt, temperature=0.7, max_tokens=2000)

        try:
            questions = json.loads(response)
            return questions
        except json.JSONDecodeError:
            return [{
                "question": "What are the main concepts in this content?",
                "type": "SHORT_ANSWER",
                "correct_answer": response,
                "explanation": "Summary of main concepts",
                "difficulty": "MEDIUM",
                "tags": []
            }]

    def generate_cheatsheet(self, content: str, title: str = "Study Guide") -> Dict:
        """Generate a structured cheat sheet from learning content"""
        system_prompt = """You are an expert at creating concise, well-organized study guides.
        Create structured cheat sheets with clear sections, key concepts, and examples."""

        user_prompt = f"""Create a comprehensive cheat sheet for: {title}

Content:
{content}

Return as JSON with this structure:
{{
  "title": "Cheat Sheet Title",
  "sections": [
    {{
      "title": "Section Name",
      "content": "Section content",
      "key_points": ["Point 1", "Point 2"],
      "examples": ["Example 1"]
    }}
  ],
  "tags": ["tag1", "tag2"]
}}

Only return the JSON object."""

        response = self._call_ai(system_prompt, user_prompt, temperature=0.6, max_tokens=2500)

        try:
            cheatsheet = json.loads(response)
            return cheatsheet
        except json.JSONDecodeError:
            return {
                "title": title,
                "sections": [{
                    "title": "Overview",
                    "content": response,
                    "key_points": [],
                    "examples": []
                }],
                "tags": []
            }

    def analyze_weak_points(self, performance_data: List[Dict]) -> List[Dict]:
        """Analyze performance data to identify weak points"""
        system_prompt = """You are an expert learning analytics specialist.
        Analyze student performance data to identify concepts they struggle with."""

        # Format performance data
        data_summary = "\n".join([
            f"- {item.get('concept', 'Unknown')}: Score {item.get('score', 0)}% "
            f"(Attempts: {item.get('attempts', 0)})"
            for item in performance_data
        ])

        user_prompt = f"""Analyze this performance data and identify weak points:

{data_summary}

Return as JSON array:
[
  {{
    "concept": "Concept name",
    "score": average_score,
    "reason": "Why this is a weak point",
    "recommendations": ["Suggestion 1", "Suggestion 2"]
  }}
]

Only return concepts with scores below 70%."""

        response = self._call_ai(system_prompt, user_prompt, temperature=0.5, max_tokens=1500)

        try:
            weak_points = json.loads(response)
            return weak_points
        except json.JSONDecodeError:
            return []

    def generate_study_recommendations(self, weak_points: List[str],
                                      study_field: str) -> List[Dict]:
        """Generate personalized study recommendations"""
        system_prompt = """You are an expert educational advisor.
        Provide personalized study recommendations based on student's weak points."""

        weak_points_text = ", ".join(weak_points)

        user_prompt = f"""Student is studying {study_field} and struggling with: {weak_points_text}

Provide 3-5 specific learning recommendations with resources.

Return as JSON array:
[
  {{
    "title": "Recommendation title",
    "reason": "Why this helps",
    "resources": ["Resource 1", "Resource 2"],
    "estimated_time": "Time estimate",
    "priority": "HIGH, MEDIUM, or LOW"
  }}
]"""

        response = self._call_ai(system_prompt, user_prompt, temperature=0.7, max_tokens=1500)

        try:
            recommendations = json.loads(response)
            return recommendations
        except json.JSONDecodeError:
            return []


# Singleton instance
_ai_service = None

def get_ai_service() -> AIService:
    """Get or create AI service instance"""
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service
