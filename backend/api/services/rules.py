def classify_state(signals):
    return (
        f"{signals['sleep']}_"
        f"{signals['mood']}_"
        f"{signals['stress']}_"
        f"{signals['energy']}"
    )