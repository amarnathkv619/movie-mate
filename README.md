# 🎬 MovieMate

**MovieMate** is a modern full-stack application designed to track your personal movie and TV show collection. It features an interactive glassmorphism UI, real-time data fetching from TMDB, and an AI-powered recommendation engine to help you decide what to watch next.

<img width="1364" height="607" alt="MovieMate UI" src="https://github.com/user-attachments/assets/87f632f4-9113-461d-8814-2bb962adb47f" />

---

## 🚀 Tech Stack

### **Frontend**
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS v4 
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **Visualization:** Recharts (Data Analytics)
* **Icons:** React Icons

### **Backend**
* **Framework:** FastAPI (Python)
* **Database:** SQLite 
* **ORM:** SQLAlchemy
* **Validation:** Pydantic

### **External APIs**
* **TMDB (The Movie Database):** Used for auto-filling metadata (Posters, Genres, Directors, Ratings).

---
## ✨ Features

### AI & Discovery
- Content-based recommendation engine analyzing your Completed list
- Suggests movies you haven’t watched
- Auto-fill metadata from TMDB (title, poster, genres, plot, director, rating)

### Analytics Dashboard
- Pie chart: Watching vs Completed
- Pie chart: Top Genres

### UI/UX
- Modern glassmorphism UI
- Dark theme
- Smooth animations
- 3D flip cards
- Fully responsive

### Core Features
- Add / Edit / Delete movies & shows
- Multi-select filters + search
- Episode progress tracking
- Ratings & reviews

---

## 🛠 Installation & Setup

### Prerequisites
- Node.js (16+)
- Python (3.8+)

---

## 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <your-project-folder>
```

---

## 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
```

### Activate Environment
Windows:
```bash
.\venv\Scripts\activate
```
Mac/Linux:
```bash
source venv/bin/activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Server
```bash
fastapi dev main.py
```

Backend URL: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs

---

## 3. Frontend Setup
```bash
cd frontend
npm install
```

---

## 4. Add Environment Variables  
Create **frontend/.env**:

```
VITE_API_URL=http://127.0.0.1:8000
VITE_TMDB_API_KEY=your_tmdb_api_key
```

---

## 5. Start Frontend
```bash
npm run dev
```

Runs at: http://localhost:5173

---

## 🎉 Done!
Your MovieMate app is ready! 🍿🎥
