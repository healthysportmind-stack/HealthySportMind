from celery import shared_task
from django.contrib.auth import get_user_model
from api.services.long_term import generate_long_term_insight
from api.services.message_generator import rewrite_message_tone
from api.models import Feedback

User = get_user_model()

@shared_task
def run_weekly_checkins():
    for user in User.objects.all():
        base_message, category = generate_long_term_insight(user, 7)

        tone = getattr(user.profile, "preferred_tone", "neutral")
        try:
            final_message = rewrite_message_tone(base_message, tone)
            ai_used = True
        except:
            final_message = base_message
            ai_used = False

        Feedback.objects.create(
            user=user,
            ai_used=ai_used,
            category=category,
            feedback_type="long_term",
            message=final_message,
        )


@shared_task
def run_monthly_checkins():
    for user in User.objects.all():
        base_message, category = generate_long_term_insight(user, 30)

        tone = getattr(user.profile, "preferred_tone", "neutral")
        try:
            final_message = rewrite_message_tone(base_message, tone)
            ai_used = True
        except:
            final_message = base_message
            ai_used = False

        Feedback.objects.create(
            user=user,
            ai_used=ai_used,
            category=category,
            feedback_type="long_term",
            message=final_message,
        )
