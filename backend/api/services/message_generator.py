import random
from .signals import mood_signal, stress_signal, energy_signal, sleep_signal
from .rules import classify_state
from .message_registry import MESSAGES

def generate_post_checkin_message(checkin):
    signals = {
        "mood": mood_signal(checkin.mood),
        "stress": stress_signal(checkin.stress),
        "energy": energy_signal(checkin.energy),
        "sleep": sleep_signal(checkin.sleep_hours),
    }

    category = classify_state(signals)
    message = random.choice(MESSAGES[category])
    return message,category