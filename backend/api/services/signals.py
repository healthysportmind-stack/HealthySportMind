def mood_signal(mood):
    if mood <= 1: return "very_low"
    if mood == 2: return "low"
    if mood == 3: return "neutral"
    if mood == 4: return "good"
    return "very_good"

def stress_signal(stress):
    if stress >= 4: return "high"
    if stress == 3: return "medium"
    return "low"

def energy_signal(energy):
    if energy <= 2: return "low"
    if energy == 3: return "medium"
    return "high"

def sleep_signal(hours):
    if hours < 6: return "under"
    if hours > 9: return "over"
    return "normal"