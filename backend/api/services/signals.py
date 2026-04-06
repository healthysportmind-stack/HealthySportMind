def mood_signal(mood):
    if mood <= 3:
        return "lowmood"
    if 4 <= mood <= 6:
        return "mediummood"
    return "highmood"


def stress_signal(stress):
    if stress <= 3:
        return "lowstress"
    if 4 <= stress <= 6:
        return "mediumstress"
    return "highstress"


def energy_signal(energy):
    if energy <= 3:
        return "lowenergy"
    if 4 <= energy <= 6:
        return "mediumenergy"
    return "highenergy"


def sleep_signal(hours):
    if hours <= 5:
        return "lowsleep"
    if 6 <= hours <= 7:
        return "mediumsleep"
    if hours >= 8:
        return "highsleep"

    return "highsleep"