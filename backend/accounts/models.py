from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    REQUIRED_FIELDS = ["email", "first_name", "last_name"]
    email = models.EmailField(
        unique=True,
        blank=False,
        null=False,
    )

    first_name = models.CharField(
        max_length=150,
        blank=False,
    )

    last_name = models.CharField(
        max_length=150,
        blank=False,
    )
