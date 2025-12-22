# backend/core/utils/images.py
import uuid
from PIL import Image
from io import BytesIO
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


def save_image(
    uploaded_file,
    directory="alumnos/fotos/",
    size=(300, 300),
    quality=80,
):
    filename = f"{uuid.uuid4().hex}.jpg"
    path = f"{directory}{filename}"

    img = Image.open(uploaded_file).convert("RGB")
    img.thumbnail(size)

    buffer = BytesIO()
    img.save(buffer, format="JPEG", quality=quality, optimize=True)

    default_storage.save(path, ContentFile(buffer.getvalue()))
    return path
