LONG_TERM_RULES = [
    ("stress_hurting_mood", lambda f: f["stress_mood_corr"] < -0.5),
    ("sleep_driving_mood", lambda f: f["sleep_mood_corr"] > 0.5),
    ("sleep_inconsistent", lambda f: f["sleep_variation"] > 1.5),
    ("mood_inconsistent", lambda f: f["mood_variation"] > 1.0),
    ("stress_inconsistent", lambda f: f["stress_variation"] > 1.0),

    ("sleep_trending_up", lambda f: f["sleep_trend"] > 0.1),
    ("sleep_trending_down", lambda f: f["sleep_trend"] < -0.1),

    ("mood_improving", lambda f: f["mood_trend"] > 0.1),
    ("mood_declining", lambda f: f["mood_trend"] < -0.1),

    ("stress_increasing", lambda f: f["stress_trend"] > 0.1),
    ("stress_decreasing", lambda f: f["stress_trend"] < -0.1),
]
