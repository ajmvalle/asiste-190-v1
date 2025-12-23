from django.db import models
from students.models import Alumno


class AlumnoFace(models.Model):
    alumno = models.OneToOneField(
        Alumno,
        on_delete=models.CASCADE,
        related_name="face"
    )
    embedding = models.BinaryField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rostro - {self.alumno.numero_control}"


class Attendance(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    source = models.CharField(max_length=50, default="facial")

    def __str__(self):
        return f"{self.alumno.numero_control} - {self.timestamp}"
