import numpy as np
from face_recognition.models import AlumnoFace


def find_best_match(embedding, threshold=0.9):
    best_dist = 999
    best_alumno = None

    for face in AlumnoFace.objects.select_related("alumno"):
        saved = np.frombuffer(face.embedding, dtype=np.float32)
        dist = np.linalg.norm(embedding - saved)

        if dist < best_dist:
            best_dist = dist
            best_alumno = face.alumno

    if best_dist < threshold:
        return best_alumno, best_dist

    return None, best_dist
