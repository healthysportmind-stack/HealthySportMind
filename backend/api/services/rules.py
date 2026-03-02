def classify_state(signals):
    mood = signals["mood"]
    stress = signals["stress"]
    energy = signals["energy"]
    sleep = signals["sleep"]

    if mood in ["very_low", "low"] and stress == "high":
        return "overwhelmed"

    if energy == "low" and sleep == "under":
        return "fatigue"

    if mood in ["good", "very_good"] and energy == "high":
        return "momentum"

    return "steady"