import cv2
import numpy as np
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from students.models import Alumno
from face_recognition.models import AlumnoFace
from face_recognition.services.embedder import get_face_embedding


class CaptureFaceView(APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request, alumno_id):
        alumno = get_object_or_404(Alumno, id=alumno_id)
        image = request.FILES.get("image")

        if not image:
            return Response(
                {"error": "Imagen requerida"}, status=status.HTTP_400_BAD_REQUEST
            )

        img = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)

        embedding = get_face_embedding(img)

        if embedding is None:
            return Response(
                {"error": "No se detectó rostro"}, status=status.HTTP_400_BAD_REQUEST
            )

        AlumnoFace.objects.update_or_create(
            alumno=alumno, defaults={"embedding": embedding.tobytes()}
        )

        return Response({"ok": True})
