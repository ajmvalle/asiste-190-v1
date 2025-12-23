import numpy as np
from insightface.app import FaceAnalysis

# Modelo global (singleton)
model = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
model.prepare(ctx_id=0, det_size=(320, 320))


def get_face_embedding(img):
    """
    Recibe imagen BGR (OpenCV) y regresa embedding normalizado (np.ndarray)
    """
    faces = model.get(img)

    if not faces:
        return None

    emb = faces[0].embedding.astype("float32")
    norm = np.linalg.norm(emb)

    if norm == 0:
        return None

    return emb / norm
