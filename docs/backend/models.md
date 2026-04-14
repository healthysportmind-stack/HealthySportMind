
The app uses Django's built-in `User` model together with a `Profile` model. `User` is used for authentication and token auth, while `Profile` stores app-specific user preferences.

### CheckIn
Represents a daily user check-in with mood, stress, energy, sleep, and optional notes.

Fields:
- `user`: `ForeignKey(User, on_delete=models.CASCADE, related_name="checkins")`
- `mood`: `IntegerField`
- `stress`: `IntegerField`
- `energy`: `IntegerField`
- `sleep_hours`: `FloatField`
- `notes`: `TextField(blank=True, null=True)`
- `post_message`: `TextField(blank=True, null=True)`
- `created_at`: `DateTimeField(auto_now_add=True)`
- `updated_at`: `DateTimeField(auto_now=True)`

Methods:
- `is_today(self)`: returns `True` when `created_at` is the current date.
- `__str__(self)`: returns a string containing the user email and the check-in date.

### Profile
Stores user profile preferences and notification settings.

Fields:
- `user`: `OneToOneField(User, on_delete=models.CASCADE)`
- `preferred_tone`: `CharField(max_length=100, blank=True, default="calm")`
- `name`: `CharField(max_length=100, blank=True)`
- `sport`: `CharField(max_length=100, blank=True)`
- `notif_weekly`: `BooleanField(default=True)`
- `notif_monthly`: `BooleanField(default=True)`
- `experience_level`: `CharField(max_length=20, choices=[("beginner", "Beginner"), ("intermediate", "Intermediate"), ("advanced", "Advanced")], default="beginner")`
- `preferred_checkin_time`: `TimeField(null=True, blank=True)`
- `training_days`: `JSONField(default=list, blank=True)`
- `goals`: `TextField(blank=True)`

Note: The last 4 fields have no implementation yet. We had plans for them but, never got around to implementing their functionality.

Methods:
- `__str__(self)`: returns the profile display string for the related user.

### PerformanceLog
Captures periodic performance ratings, mood history, and comments.

Fields:
- `user`: `ForeignKey(User, on_delete=models.CASCADE, related_name="performance_logs")`
- `moods`: `JSONField(default=list)`
- `performance_rating`: `IntegerField`
- `comments`: `TextField(blank=True, null=True)`
- `created_at`: `DateTimeField(auto_now_add=True)`

Methods:
- `__str__(self)`: returns a string with username, log date, and rating.

### Feedback
Records AI-generated or user-related feedback linked optionally to a check-in.

Fields:
- `user`: `ForeignKey(User, on_delete=models.CASCADE)`
- `checkin`: `ForeignKey(CheckIn, on_delete=models.CASCADE, null=True, blank=True)`
- `ai_used`: `BooleanField(default=True)`
- `category`: `CharField(max_length=50)`
- `window_days`: `IntegerField(null=True, blank=True)`
- `feedback_type`: `CharField(max_length=20, choices=[("short_term", "Short Term"), ("long_term", "Long Term")])`
- `message`: `TextField()`
- `created_at`: `DateTimeField(auto_now_add=True)`

Methods:
- `__str__(self)`: returns a string referencing the associated check-in date when present, otherwise the long-term category.
