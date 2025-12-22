from django.urls import path
from .views import AlumnoListCreateView, AlumnoDetailView

urlpatterns = [
    path("alumnos/", AlumnoListCreateView.as_view()),
    path("alumnos/<int:alumno_id>/", AlumnoDetailView.as_view()),
]