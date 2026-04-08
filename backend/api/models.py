from django.db import models
from django.contrib.auth import get_user_model
from datetime import date

User = get_user_model()
class CheckIn(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="checkins")
    mood = models.IntegerField()
    stress = models.IntegerField()
    energy = models.IntegerField()
    sleep_hours = models.FloatField()
    notes = models.TextField(blank=True, null=True)

    post_message = models.TextField(blank = True, null = True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_today(self):
        return self.created_at.date() == date.today()

    def __str__(self):
        return f"{self.user.email} - {self.created_at.date()}"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    preferred_tone = models.CharField(
        max_length=100,
        blank=True,
        default="calm"
    )
    name = models.CharField(max_length=100, blank=True)
    sport = models.CharField(max_length=100, blank=True)
    notif_weekly=models.BooleanField(default=True)
    notif_monthly = models.BooleanField(default=True)
    experience_level = models.CharField(
        max_length=20,
        choices=[
            ("beginner", "Beginner"),
            ("intermediate", "Intermediate"),
            ("advanced", "Advanced"),
        ],
        default="beginner"
    )

    preferred_checkin_time = models.TimeField(null=True, blank=True)
    training_days = models.JSONField(default=list, blank=True)
    goals = models.TextField(blank=True)
    def __str__(self):
        return f"{self.user.username}'s Profile"

class PerformanceLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="performance_logs")
    moods = models.JSONField(default=list)
    performance_rating = models.IntegerField()
    comments = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_at.date()} - Rating: {self.performance_rating}"

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    checkin = models.ForeignKey(
        CheckIn,
        on_delete=models.CASCADE,
        null=True,
        blank = True
    )
    ai_used = models.BooleanField(default = True)
    category = models.CharField(max_length=50)
    window_days = models.IntegerField(null=True, blank=True)
    feedback_type = models.CharField(max_length = 20,choices = [
        ("short_term", "Short Term"),
        ("long_term", "Long Term"),
    ])
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.checkin is not None:
            return f"{self.user} | Check-in {self.checkin.created_at:%Y-%m-%d}"
        return f"{self.user} | Long-term: {self.category}"

