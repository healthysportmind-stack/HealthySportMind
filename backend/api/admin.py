from django.contrib import admin
from .models import CheckIn,Profile,Feedback
admin.site.register(Profile)

admin.site.register(CheckIn)

admin.site.register(Feedback)
# Register your models here.
