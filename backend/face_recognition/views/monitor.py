import cv2
import numpy as np
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status

from face_recognition.services.embedder import get_face_embedding
from face_recognition.services.matcher import find_best_match
from face_recognition.models import Attendance
from face_recognition.services.distance_sensor import distance_sensor

from django.utils import timezone


class RecognizeFaceView(APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request):
        distance_cm = distance_sensor.get_distance_cm()

        if not distance_cm:
            return Response(
                {
                    "match": False,
                    "reason": "DISTANCE_READ_ERROR",
                    "message": "No se pudo leer el sensor",
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if distance_cm < 2 or distance_cm > 10:
            return Response(
                {
                    "match": False,
                    "reason": "DISTANCE_INVALID",
                    "message": f"Acércate a 15 cm. Actual: {distance_cm} cm",
                    "distance_cm": distance_cm,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        image = request.FILES.get("image")

        if not image:
            return Response(
                {"error": "Imagen requerida"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        img = cv2.imdecode(
            np.frombuffer(image.read(), np.uint8),
            cv2.IMREAD_COLOR,
        )

        embedding = get_face_embedding(img)

        if embedding is None:
            return Response({"match": False, "reason": "No face detected"})

        alumno, dist = find_best_match(embedding)

        if not alumno:
            return Response({"match": False, "distance": float(dist)})

        today = timezone.localdate()

        already_checked = Attendance.objects.filter(
            alumno=alumno,
            attendance_date=today,
        ).exists()

        foto_url = request.build_absolute_uri(alumno.foto.url) if alumno.foto else None

        if already_checked:
            return Response(
                {
                    "match": True,
                    "already_registered": True,
                    "alumno": alumno.nombre_completo,
                    "id": alumno.id,
                    "distance": float(dist),
                }
            )

        Attendance.objects.create(alumno=alumno, attendance_date=today)

        return Response(
            {
                "match": True,
                "already_registered": False,
                "alumno": alumno.nombre_completo,
                "id": alumno.id,
                "foto_url": foto_url,
                "distance": float(dist),
            }
        )
