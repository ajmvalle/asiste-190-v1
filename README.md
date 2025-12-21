# React + Django Auth Starter Kit

Starter kit para proyectos modernos con autenticación usando:

- Django
- Django REST Framework
- React
- React Router
- Vite

Pensado como base para proyectos reales, no como demo.

---

## 🧱 Stack

### Backend
- Python **3.11.9**
- Django **5.2.9**
- Django REST Framework **3.16.1**
- django-cors-headers **4.9.0**
- MySQL (mysqlclient **2.2.7**)
- python-dotenv **1.2.1**

### Frontend
- Node.js **18+** (recomendado)
- React **19.2**
- React Router **7.10**
- Vite **7**
- TypeScript **5.9**
- Tailwind CSS **4**

### UI
- TailAdmin (React)  
  https://react-demo.tailadmin.com/

---

## 📁 Estructura general
```bash
react-django-base-auth/
│
├── backend/
│ ├── core/
│ ├── users/
│ ├── manage.py
│ ├── .env.example
│
├── frontend/
│ ├── src/
│ ├── index.html
│ ├── package.json
│
├── requirements.txt
└── README.md
```
## 🚀 Instalación rápida

### 1 Clonar el repositorio

```bash
git clone https://github.com/ajmvalle/react-django-base-auth.git
cd react-django-base-auth
```


### 2 Backend Django
Crear entorno virtual e instalar dependencias:

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Crear archivo .env:
```bash
cd backend
cp .env.example .env
```
Generar SECRET_KEY
```bash
python - <<EOF
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
EOF
```
Pegar el valor generado en el archivo .env.

Ejecutar migraciones y levantar el servidor:
```bash
python manage.py migrate
python manage.py runserver
```

Backend disponible en:
```bash
http://127.0.0.1:8000
```

### 3 Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Frontend disponible en:
```bash
http://127.0.0.1:5173
```

### Nota importante sobre la UI

El frontend utiliza _TailAdmin_ React como base visual:
https://react-demo.tailadmin.com/

Este starter:
- Usa la estructura y estilos de TailAdmin
- No incluye funcionalidades premium
- Está pensado como base técnica, no como clon comercial

## 📄 Licencia
MIT