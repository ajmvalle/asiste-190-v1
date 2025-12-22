from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

from .models import Alumno
from .serializers import AlumnoSerializer


class AlumnoListCreateView(APIView):
    """
    GET  -> Listar alumnos
    POST -> Crear alumno (con o sin foto)
    """

    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        alumnos = Alumno.objects.all().order_by("especialidad", "grado", "grupo")
        serializer = AlumnoSerializer(alumnos, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AlumnoSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        alumno = serializer.save()

        return Response(
            AlumnoSerializer(alumno, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class AlumnoDetailView(APIView):
    """
    GET    -> Ver alumno
    PUT    -> Editar alumno (parcial)
    DELETE -> Eliminar alumno
    """

    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, alumno_id):
        alumno = get_object_or_404(Alumno, id=alumno_id)
        serializer = AlumnoSerializer(alumno, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, alumno_id):
        alumno = get_object_or_404(Alumno, id=alumno_id)

        serializer = AlumnoSerializer(
            alumno,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, alumno_id):
        alumno = get_object_or_404(Alumno, id=alumno_id)
        alumno.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
