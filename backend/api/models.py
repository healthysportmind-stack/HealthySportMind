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

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_today(self):
        return self.created_at.date() == date.today()

    def __str__(self):
        return f"{self.user.email} - {self.created_at.date()}"

