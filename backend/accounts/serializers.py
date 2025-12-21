from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
import re

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        error_messages={
            "blank": "El usuario es obligatorio.",
            "required": "El usuario es obligatorio.",
            "invalid": "Solo letras, números o guión bajo.",
        },
    )

    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Este correo ya está registrado.",
            )
        ],
        error_messages={
            "blank": "El correo es obligatorio.",
            "invalid": "Correo electrónico inválido.",
        },
    )

    first_name = serializers.CharField(
        required=True,
        error_messages={"blank": "El nombre es obligatorio."},
    )

    last_name = serializers.CharField(
        required=True,
        error_messages={"blank": "El apellido es obligatorio."},
    )

    password = serializers.CharField(
        write_only=True,
        error_messages={"blank": "La contraseña es obligatoria."},
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
        )

    def validate_username(self, value):
        value = value.lower()

        if " " in value:
            raise serializers.ValidationError("El usuario no puede contener espacios.")

        if len(value) < 8:
            raise serializers.ValidationError(
                "El usuario debe tener al menos 8 caracteres."
            )

        if not re.match(r"^[a-z0-9_]+$", value):
            raise serializers.ValidationError("Solo letras, números o guión bajo.")

        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
