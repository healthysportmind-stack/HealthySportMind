## Purpose

Long-term messages summarize trends and patterns across multiple check-ins, rather than responding to a single submission. They are used for weekly and monthly insights.

## Main flow

1. The app calls `generate_long_term_insight(user, days)` from `backend/api/services/long_term.py`.
2. `get_checkins_for_window(user, days)` fetches check-ins from the last `days` days.
3. `compute_long_term_features(checkins)` calculates statistical features from those check-ins:
   - trends using linear regression slopes (`sleep_trend`, `mood_trend`, `stress_trend`, `energy_trend`)
   - variability using standard deviation (`sleep_variation`, `mood_variation`, `stress_variation`, `energy_variation`)
   - correlations between metrics (`sleep_mood_corr`, `stress_mood_corr`, `sleep_stress_corr`, `energy_mood_corr`)
4. `classify_long_term(features)` tests the feature set against rule functions in `backend/api/services/long_term_rules.py`.
5. The first matching rule category is returned, or `stable_overall` if none match.
6. A base message is selected from `LONG_TERM_MESSAGES` in `backend/api/services/long_term_messages.py`.
7. The message and category are returned to the caller.

## Categories and rules

Rule categories are defined in `backend/api/services/long_term_rules.py` and checked in order:
- `stress_hurting_mood`: strong negative correlation between stress and mood
- `sleep_driving_mood`: strong positive correlation between sleep and mood
- `sleep_inconsistent`: sleep variation above threshold
- `mood_inconsistent`: mood variation above threshold
- `stress_inconsistent`: stress variation above threshold
- `sleep_trending_up`: positive sleep trend
- `sleep_trending_down`: negative sleep trend
- `mood_improving`: positive mood trend
- `mood_declining`: negative mood trend
- `stress_increasing`: positive stress trend
- `stress_decreasing`: negative stress trend

If no rule matches, the default category is `stable_overall`.

## Message selection

Messages are defined in `backend/api/services/long_term_messages.py` as a mapping from category keys to message strings. Example messages include:
- `stress_hurting_mood`
- `sleep_driving_mood`
- `sleep_inconsistent`
- `mood_inconsistent`
- `stress_inconsistent`
- `sleep_trending_up`
- `sleep_trending_down`
- `mood_improving`
- `mood_declining`
- `stress_increasing`
- `stress_decreasing`
- `stable_overall`
- `no_data`

## API usage

Long-term insights are generated in these views:
- `backend/api/views.py` `WeeklyCheckInView.post()` uses `generate_long_term_insight(request.user, 7)`
- `backend/api/views.py` `MonthlyCheckInView.post()` uses `generate_long_term_insight(request.user, 30)`

Both views then attempt to rewrite the selected base message into the user's preferred tone using `api.utils.ai.rewrite_message_tone(...)`. If tone rewriting fails, the raw base message is used instead.

## Feedback storage

After generating the long-term message, the app creates a `Feedback` record with:
- `feedback_type = "long_term"`
- `category` set to the selected category
- `message` set to the final message
- `window_days` set to `7` or `30`

This means long-term insights are stored as feedback entries that can be retrieved later.

## Periodic tasks

There are also intended Celery tasks in `backend/api/tasks.py` for scheduled long-term check-ins:
- `run_weekly_checkins()` for weekly insights
- `run_monthly_checkins()` for monthly insights

These tasks follow the same generation and tone-rewrite pattern, and they create `Feedback` records for each user.

## Files involved

- `backend/api/services/long_term.py`
- `backend/api/services/long_term_rules.py`
- `backend/api/services/long_term_messages.py`
- `backend/api/views.py`
- `backend/api/models.py` (`Feedback`)
- `backend/api/tasks.py`
- `backend/api/utils/ai.py` (`rewrite_message_tone`)
