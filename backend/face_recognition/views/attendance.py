from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from django.db.models import Q
from django.utils import timezone

from face_recognition.models import Attendance
from students.models import Alumno


class AttendanceByDateView(APIView):
    def get(self, request):
        date_str = request.GET.get("date")
        date = parse_date(date_str)

        if not date:
            return Response({"error": "Fecha inválida"}, status=400)

        filters = Q()

        if request.GET.get("nombre"):
            filters &= Q(nombre_completo__icontains=request.GET["nombre"])

        if request.GET.get("grado"):
            filters &= Q(grado=request.GET["grado"])

        if request.GET.get("grupo"):
            filters &= Q(grupo=request.GET["grupo"])

        if request.GET.get("turno"):
            filters &= Q(turno=request.GET["turno"])

        if request.GET.get("especialidad"):
            filters &= Q(especialidad=request.GET["especialidad"])

        alumnos_filtrados = Alumno.objects.filter(filters)

        asistencias = (
            Attendance.objects.filter(
                attendance_date=date,
                alumno__in=alumnos_filtrados,
            )
            .select_related("alumno")
            .order_by("timestamp")
        )

        asistentes_ids = asistencias.values_list("alumno_id", flat=True)

        inasistencias = alumnos_filtrados.exclude(id__in=asistentes_ids)

        return Response(
            {
                "fecha": date,
                "asistencias": [
                    {
                        "id": a.alumno.id,
                        "numero_control": a.alumno.numero_control,
                        "nombre": a.alumno.nombre_completo,
                        "grado": a.alumno.grado,
                        "grupo": a.alumno.grupo,
                        "turno": a.alumno.turno,
                        "especialidad": a.alumno.especialidad,
                        "hora": timezone.localtime(a.timestamp).strftime("%H:%M:%S"),
                        "source": a.source,
                        "foto_url": (
                            request.build_absolute_uri(a.alumno.foto.url)
                            if a.alumno.foto
                            else None
                        ),
                    }
                    for a in asistencias
                ],
                "inasistencias": [
                    {
                        "id": a.id,
                        "numero_control": a.numero_control,
                        "nombre": a.nombre_completo,
                        "grado": a.grado,
                        "grupo": a.grupo,
                        "turno": a.turno,
                        "especialidad": a.especialidad,
                        "foto_url": (
                            request.build_absolute_uri(a.foto.url) if a.foto else None
                        ),
                    }
                    for a in inasistencias
                ],
            }
        )
