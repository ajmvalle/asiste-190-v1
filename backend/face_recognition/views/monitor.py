import cv2
import numpy as np
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status

from face_recognition.services.embedder import get_face_embedding
from face_recognition.services.matcher import find_best_match
from face_recognition.models import Attendance

from django.utils import timezone


class RecognizeFaceView(APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request):
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
            timestamp__date=today,
        ).exists()

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

        Attendance.objects.create(alumno=alumno)

        return Response(
            {
                "match": True,
                "already_registered": False,
                "alumno": alumno.nombre_completo,
                "id": alumno.id,
                "distance": float(dist),
            }
        )
