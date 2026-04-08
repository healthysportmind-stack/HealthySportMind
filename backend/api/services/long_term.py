from datetime import timedelta
from django.utils import timezone
from api.models import CheckIn
import numpy as np
import random
from .long_term_messages import LONG_TERM_MESSAGES
from .long_term_rules import LONG_TERM_RULES

def get_checkins_for_window(user, days):
    cutoff = timezone.now() - timedelta(days=days)
    return CheckIn.objects.filter(
        user=user,
        created_at__gte=cutoff
    ).order_by("created_at")


def compute_long_term_features(checkins):
    if not checkins:
        return None

    sleep = np.array([c.sleep_hours for c in checkins])
    mood = np.array([c.mood for c in checkins])
    stress = np.array([c.stress for c in checkins])
    energy = np.array([c.energy for c in checkins])

    def slope(values):
        if len(values) < 2:
            return 0
        x = np.arange(len(values))
        m, _ = np.polyfit(x, values, 1)
        return m

    def variation(values):
        if len(values) < 2:
            return 0
        return float(np.std(values))

    def corr(a, b):
        if len(a) < 2 or len(b) < 2:
            return 0
        r = np.corrcoef(a, b)[0, 1]
        return float(r)

    return {
        # Trends
        "sleep_trend": slope(sleep),
        "mood_trend": slope(mood),
        "stress_trend": slope(stress),
        "energy_trend": slope(energy),

        # Variation
        "sleep_variation": variation(sleep),
        "mood_variation": variation(mood),
        "stress_variation": variation(stress),
        "energy_variation": variation(energy),

        # Correlations
        "sleep_mood_corr": corr(sleep, mood),
        "stress_mood_corr": corr(stress, mood),
        "sleep_stress_corr": corr(sleep, stress),
        "energy_mood_corr": corr(energy, mood),
    }

def classify_long_term(features):
    for category, rule in LONG_TERM_RULES:
        if rule(features):
            return category
    return "stable_overall"


def generate_long_term_insight(user, days):
    checkins = get_checkins_for_window(user, days)
    features = compute_long_term_features(checkins)

    if not features:
        return "Not enough data for long-term insights.", "no_data"

    category = classify_long_term(features)
    base_message = random.choice(LONG_TERM_MESSAGES[category])

    return base_message, category
