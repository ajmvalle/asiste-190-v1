import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .helpers import user_payload

from .serializers import RegisterSerializer

User = get_user_model()


def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    user = authenticate(
        request,
        username=data.get("username"),
        password=data.get("password"),
    )

    if user is None:
        return JsonResponse({"error": "Credenciales inválidas"}, status=401)

    login(request, user)

    return JsonResponse(
        {
            "message": "Login correcto",
            "user": user_payload(user),
        }
    )


def register_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    serializer = RegisterSerializer(data=data)

    if not serializer.is_valid():
        return JsonResponse(serializer.errors, status=400)

    user = serializer.save()

    login(request, user)

    return JsonResponse(
        {
            "message": "Usuario creado",
            "user": user_payload(user),
        },
        status=201,
    )


def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Sesión cerrada"})


def dashboard_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "No autenticado"}, status=401)

    return JsonResponse(
        {
            "message": "Bienvenido al dashboard",
            "user": request.user.username,
        }
    )


def me_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "No autenticado"}, status=401)

    user = request.user
    return JsonResponse(
        {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }
    )


@ensure_csrf_cookie
def csrf_view(request):
    return JsonResponse({"message": "CSRF cookie set"})
