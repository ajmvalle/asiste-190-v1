from django.urls import path
from face_recognition.views.capture import CaptureFaceView
from face_recognition.views.monitor import RecognizeFaceView

urlpatterns = [
    path("students/<int:alumno_id>/face/", CaptureFaceView.as_view()),
    path("monitor/recognize/", RecognizeFaceView.as_view()),
]
