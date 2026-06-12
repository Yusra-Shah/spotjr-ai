import json
import logging
from app.config import settings

logger = logging.getLogger(__name__)

_FALLBACK_ATTRIBUTES = {
    "age_range": "6-8",
    "upper_clothing": "pink shirt",
    "lower_clothing": "dark pants",
    "accessories": ["stuffed toy"],
    "height_estimate": "short (~110cm)",
}


def _make_client():
    """Return an AsyncAzureOpenAI client if credentials are configured, else None."""
    if not settings.azure_openai_endpoint or not settings.azure_openai_api_key:
        return None
    try:
        from openai import AsyncAzureOpenAI
        return AsyncAzureOpenAI(
            azure_endpoint=settings.azure_openai_endpoint,
            api_key=settings.azure_openai_api_key,
            api_version="2024-02-01",
        )
    except ImportError:
        logger.warning("openai package not installed; using fallback responses")
        return None


class FoundryService:
    def __init__(self):
        self._client = _make_client()

    async def analyze_child_description(self, description: str) -> dict:
        """Extract structured child attributes from a natural language description."""
        if not self._client:
            return _FALLBACK_ATTRIBUTES

        try:
            response = await self._client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a child safety AI assistant. Extract structured attributes "
                            "from a description of a missing child. Return a JSON object with "
                            "keys: age_range (string), upper_clothing (string), lower_clothing "
                            "(string), accessories (list of strings), height_estimate (string)."
                        ),
                    },
                    {"role": "user", "content": description},
                ],
                response_format={"type": "json_object"},
                max_tokens=256,
            )
            return json.loads(response.choices[0].message.content)
        except Exception as exc:
            logger.error("analyze_child_description failed: %s", exc)
            return _FALLBACK_ATTRIBUTES

    async def generate_incident_report(self, case_data: dict) -> str:
        """Generate a professional incident report from case timeline data."""
        if not self._client:
            return (
                f"Incident Report — Case {case_data.get('case_id', 'unknown')}. "
                "Child located and returned safely to guardian. "
                "AI detection pipeline identified subject across 3 camera feeds. "
                "Security guard dispatched and arrived within 3 minutes."
            )

        try:
            response = await self._client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Generate a concise, professional security incident report. "
                            "Include: summary, timeline of key events, AI performance, guard response, "
                            "and outcome. Use formal language."
                        ),
                    },
                    {"role": "user", "content": json.dumps(case_data)},
                ],
                max_tokens=512,
            )
            return response.choices[0].message.content
        except Exception as exc:
            logger.error("generate_incident_report failed: %s", exc)
            return f"Incident report for case {case_data.get('case_id', 'unknown')}."

    async def get_risk_reasoning(self, risk_factors: list[str]) -> str:
        """Produce a plain-English explanation of why the risk score is elevated."""
        if not self._client:
            return (
                f"Risk is elevated due to: {', '.join(risk_factors)}. "
                "Child is approaching an unsupervised exit zone without adult accompaniment. "
                "Immediate response recommended."
            )

        try:
            response = await self._client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a child safety risk assessment AI. Explain in 1-2 plain English "
                            "sentences why the risk score is elevated based on the given factors. "
                            "Be concise and direct. Do not use bullet points."
                        ),
                    },
                    {"role": "user", "content": f"Risk factors: {risk_factors}"},
                ],
                max_tokens=128,
            )
            return response.choices[0].message.content
        except Exception as exc:
            logger.error("get_risk_reasoning failed: %s", exc)
            return f"Risk elevated due to: {', '.join(risk_factors)}."
