from django.db import models

class Alumno(models.Model):

    TURNO_CHOICES = [
        ("M", "Matutino"),
        ("V", "Vespertino"),
    ]

    GRUPO_CHOICES = [
        ("A", "A"),
        ("B", "B"),
    ]
    
    ESPECIALIDADES = [
        ("PROG", "Programación"),
        ("OFI", "Ofimática"),
        ("CONT", "Contabilidad"),
        ("CIA", "Comercio Internacional y Aduanas"),
        ("ENF", "Enfermería"),
        ("IA", "Inteligencia Artificial"),
        ("CIB", "Ciberseguridad"),
        ("ARH", "Administración de Recursos Humanos"),
    ]

    GRADO_CHOICES = [(i, str(i)) for i in range(1, 7)]

    numero_control = models.CharField(
        max_length=20,
        unique=True
    )

    curp = models.CharField(
        max_length=18,
        unique=True
    )

    nombre_completo = models.CharField(
        max_length=255
    )

    grado = models.PositiveSmallIntegerField(
        choices=GRADO_CHOICES
    )

    grupo = models.CharField(
        max_length=1,
        choices=GRUPO_CHOICES
    )

    turno = models.CharField(
        max_length=1,
        choices=TURNO_CHOICES
    )
    
    especialidad = models.CharField(
        max_length=5,
        choices=ESPECIALIDADES
    )

    direccion = models.TextField(blank=True)

    email = models.EmailField(blank=True)
    telefono_contacto = models.CharField(max_length=20, blank=True)

    nombre_tutor = models.CharField(max_length=255, blank=True)
    telefono_tutor = models.CharField(max_length=20, blank=True)
    email_tutor = models.EmailField(blank=True)

    foto = models.ImageField(
        upload_to="alumnos/fotos/",
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.numero_control} - {self.nombre_completo}"
