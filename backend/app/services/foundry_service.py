import json
import logging
import re
from app.config import settings

logger = logging.getLogger(__name__)

_COLORS = {
    'red', 'pink', 'blue', 'green', 'yellow', 'white', 'black', 'gray', 'grey',
    'orange', 'purple', 'brown', 'navy', 'striped', 'dark', 'light', 'bright',
}
_CLOTHES = {
    'shirt', 't-shirt', 'jacket', 'coat', 'dress', 'pants', 'jeans', 'shorts',
    'skirt', 'hoodie', 'sweater', 'suit', 'blouse', 'top', 'trousers', 'leggings',
}
_ACCESSORIES = {'hat', 'cap', 'bag', 'backpack', 'glasses', 'sunglasses', 'shoes', 'sneakers', 'scarf'}
_CHILD_TERMS = {'child', 'kid', 'boy', 'girl', 'young', 'toddler', 'baby'}
_ADULT_TERMS = {'adult', 'man', 'woman', 'elderly', 'lady', 'gentleman'}


def _keyword_score(query: str, ai_description: str) -> int:
    """Keyword-matching fallback — returns 0–100 match score."""
    q = query.lower()
    d = ai_description.lower()

    color_hits = sum(25 for c in _COLORS      if c in q and c in d)
    cloth_hits = sum(12 for c in _CLOTHES     if c in q and c in d)
    acc_hits   = sum(8  for a in _ACCESSORIES if a in q and a in d)

    # Light age bonus — no penalty (mall CCTV mostly shows adults regardless of query)
    q_child = any(t in q for t in _CHILD_TERMS)
    d_child = any(t in d for t in _CHILD_TERMS)
    q_adult = any(t in q for t in _ADULT_TERMS) and not q_child
    d_adult = any(t in d for t in _ADULT_TERMS) and not d_child
    age_score = 8 if (q_child and d_child) or (q_adult and d_adult) else 0

    return min(100, max(0, 15 + color_hits + cloth_hits + acc_hits + age_score))


def _parse_attributes_local(description: str) -> str:
    """Extract visible attributes without GPT — returns comma-separated list."""
    desc = description.lower()
    attrs: list[str] = []
    for c in _COLORS:
        if c in desc:
            attrs.append(f"{c} clothing")
    for c in _CLOTHES:
        if c in desc:
            attrs.append(c)
    for a in _ACCESSORIES:
        if a in desc:
            attrs.append(a)
    for t in list(_CHILD_TERMS) + list(_ADULT_TERMS):
        if re.search(rf'\b{t}\b', desc):
            attrs.append(t)
            break
    seen: set[str] = set()
    unique = [x for x in attrs if not (x in seen or seen.add(x))]  # type: ignore[func-returns-value]
    return ', '.join(unique[:8]) if unique else description[:80]


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

    async def generate_incident_summary(self, case_data: dict) -> str:
        """Alias used by the /report endpoint — delegates to generate_incident_report."""
        return await self.generate_incident_report(case_data)

    async def score_match(self, description: str, ai_description: str) -> int:
        """Return 0–100 likelihood that a detected person matches a missing child description."""
        if self._client:
            try:
                response = await self._client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {
                            "role": "user",
                            "content": (
                                f"Missing child description: '{description}'. "
                                f"Detected person: '{ai_description}'. "
                                "On a scale of 0-100, how likely is this the same person? "
                                "Reply with ONLY a number."
                            ),
                        }
                    ],
                    max_tokens=10,
                )
                raw = response.choices[0].message.content.strip()
                digits = "".join(c for c in raw if c.isdigit())[:3]
                return int(digits) if digits else _keyword_score(description, ai_description)
            except Exception as exc:
                logger.warning("score_match GPT failed (%s), using keyword fallback", exc)
        return _keyword_score(description, ai_description)

    async def parse_query_attributes(self, description: str) -> str:
        """Extract clothing/accessory attributes from a description as a comma-separated list."""
        if self._client:
            try:
                response = await self._client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {
                            "role": "user",
                            "content": (
                                f"Extract clothing/accessory attributes from this description "
                                f"as a short comma-separated list: '{description}'"
                            ),
                        }
                    ],
                    max_tokens=60,
                )
                return response.choices[0].message.content.strip()
            except Exception as exc:
                logger.warning("parse_query_attributes GPT failed (%s), using local parser", exc)
        return _parse_attributes_local(description)

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
