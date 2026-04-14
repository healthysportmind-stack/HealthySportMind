## Purpose

Short-term messages are created immediately after a user submits a check-in. They provide quick, actionable guidance based on the user's reported mood, stress, energy, and sleep.

## Main flow

1. The user submits a check-in through `SubmitCheckInView` in `backend/api/views.py`.
2. The check-in is saved to the `CheckIn` model.
3. `generate_post_checkin_message(checkin)` is called from `backend/api/services/message_generator.py`.
4. The raw check-in values are converted into signal categories using:
   - `mood_signal(checkin.mood)`
   - `stress_signal(checkin.stress)`
   - `energy_signal(checkin.energy)`
   - `sleep_signal(checkin.sleep_hours)`
5. `classify_state(signals)` in `backend/api/services/rules.py` builds a category key of the form:
   - `sleep_mood_stress_energy`
6. That key is used to select a list of candidate messages from `MESSAGES` in `backend/api/services/message_registry.py`.
7. The message is rewritten to the user's preferred tone via `api.utils.ai.rewrite_message_tone(...)` before saving.
8. The final message is stored in `checkin.post_message`, and a `Feedback` record is created with `feedback_type = "short_term"`.

## Category format

The computed category key is built from four signal values:
- `sleep`: one of `highsleep`, `mediumsleep`, `lowsleep`
- `mood`: one of `highmood`, `mediummood`, `lowmood`
- `stress`: one of `highstress`, `mediumstress`, `lowstress`
- `energy`: one of `highenergy`, `mediumenergy`, `lowenergy`

Example key:
- `mediumsleep_highmood_mediumstress_lowenergy`

## Message source

Messages are defined in `backend/api/services/message_registry.py` as a dictionary keyed by the category string. Each key maps to a list of one or more possible message templates.

## Tone rewriting

After selecting a base message, the system tries to rewrite it in the user's preferred tone using the AI helper:
- `api.utils.ai.rewrite_message_tone(base_message, tone)`

If the AI rewrite fails, the app falls back to the base message and still saves the short-term feedback.

## Files involved

- `backend/api/views.py`
- `backend/api/services/message_generator.py`
- `backend/api/services/rules.py`
- `backend/api/services/message_registry.py`
- `backend/api/models.py` (`CheckIn`, `Feedback`)
- `backend/api/utils/ai.py` (`rewrite_message_tone`)
