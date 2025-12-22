from rest_framework import serializers
from core.utils.images import save_image
from .models import Alumno


class AlumnoSerializer(serializers.ModelSerializer):
    numero_control = serializers.CharField(required=True, allow_blank=False)
    foto_url = serializers.SerializerMethodField()

    class Meta:
        model = Alumno
        fields = "__all__"

    # --------------------------------------------------
    # URL pública de la foto
    # --------------------------------------------------
    def get_foto_url(self, obj):
        request = self.context.get("request")
        if obj.foto and request:
            return request.build_absolute_uri(obj.foto.url)
        return None

    # --------------------------------------------------
    # CREATE: se ejecuta en POST
    # --------------------------------------------------
    def create(self, validated_data):
        # Evitamos que Django guarde la imagen automáticamente
        foto = validated_data.pop("foto", None)

        # Crear alumno sin imagen
        alumno = Alumno.objects.create(**validated_data)

        # Procesar imagen (resize, compresión, nombre único)
        if foto:
            alumno.foto = save_image(foto)
            alumno.save()

        return alumno

    # --------------------------------------------------
    # UPDATE: se ejecuta en PUT / PATCH
    # --------------------------------------------------
    def update(self, instance, validated_data):
        foto = validated_data.pop("foto", None)

        # Actualizar campos normales
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Procesar nueva imagen solo si viene
        if foto:
            # Opcional: eliminar imagen anterior
            if instance.foto:
                instance.foto.delete(save=False)

            instance.foto = save_image(foto)

        instance.save()
        return instance
