import os
import json
from fastapi import APIRouter, HTTPException
from app.schemas.schemas import AIExplainRequest, AIExplainResponse

router = APIRouter()

MOCK_RESPONSES = {
    "entropia": {
        "explanation": "La entropía es como la tendencia del universo a 'cansarse' de estar ordenado. Imagina que tienes una habitación perfectamente ordenada — el universo prefiere naturalmente el desorden.",
        "analogy": "Como un castillo de naipes: muy difícil de construir, muy fácil de derrumbar. El universo siempre está 'derrumbando' las estructuras hacia el caos.",
        "example": "Cuando dejas un café caliente en una habitación fría, el calor se dispersa hasta que todo queda a la misma temperatura. Eso es entropía máxima.",
        "related_concepts": ["termodinámica", "irreversibilidad", "tiempo termodinámico", "muerte térmica del universo"]
    }
}

def get_mock_response(word: str, level: str) -> AIExplainResponse:
    slug = word.lower().strip()
    mock = MOCK_RESPONSES.get(slug, {
        "explanation": f"'{word}' es un concepto fundamental en su campo. Representa una idea clave que conecta múltiples disciplinas del conocimiento humano.",
        "analogy": f"Piensa en '{word}' como un puente entre lo que conoces y lo que aún no has descubierto. Cada nueva conexión amplía tu comprensión.",
        "example": f"En la práctica, '{word}' se manifiesta en situaciones cotidianas que quizás no habías notado antes.",
        "related_concepts": ["conocimiento", "aprendizaje", "comprensión profunda", "pensamiento crítico"]
    })
    return AIExplainResponse(
        word=word,
        is_mock=True,
        **mock
    )

async def get_ai_response(word: str, context: str, level: str) -> AIExplainResponse:
    """Calls real Claude/OpenAI API if key available."""
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return get_mock_response(word, level)

    try:
        import httpx
        prompt = f"""Explain the word/concept "{word}" for a {level} learner.
Context: {context or 'general learning'}
Respond ONLY with valid JSON (no markdown):
{{
  "explanation": "Clear explanation in 2-3 sentences",
  "analogy": "A memorable analogy or metaphor",
  "example": "A concrete real-world example",
  "related_concepts": ["concept1", "concept2", "concept3", "concept4"]
}}"""

        if os.getenv("ANTHROPIC_API_KEY"):
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={"x-api-key": api_key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
                    json={"model": "claude-haiku-20240307", "max_tokens": 500, "messages": [{"role": "user", "content": prompt}]},
                    timeout=10
                )
                data = r.json()
                text = data["content"][0]["text"]
        else:
            async with httpx.AsyncClient() as client:
                r = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                    json={"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": prompt}], "max_tokens": 500},
                    timeout=10
                )
                data = r.json()
                text = data["choices"][0]["message"]["content"]

        parsed = json.loads(text.strip().replace("```json", "").replace("```", ""))
        return AIExplainResponse(word=word, is_mock=False, **parsed)

    except Exception as e:
        print(f"AI API error: {e}")
        return get_mock_response(word, level)

@router.post("/explain", response_model=AIExplainResponse)
async def explain_word(data: AIExplainRequest):
    return await get_ai_response(data.word, data.context or "", data.level or "intermediate")
