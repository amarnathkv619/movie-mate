from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

import models, schemas, crud
from database import SessionLocal, engine

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow Frontend (React) to talk to Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"message": "MovieMate API is Live!"}

# 1. Add a Movie
@app.post("/media/", response_model=schemas.MediaResponse)
def create_media(media: schemas.MediaCreate, db: Session = Depends(get_db)):
    return crud.create_media(db=db, media=media)

# 2. List all Movies
@app.get("/media/", response_model=List[schemas.MediaResponse])
def read_all_media(db: Session = Depends(get_db)):
    return crud.get_all_media(db)

# 3. Delete a Movie
@app.delete("/media/{media_id}")
def delete_media(media_id: int, db: Session = Depends(get_db)):
    db_media = crud.delete_media(db, media_id=media_id)
    if db_media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"message": "Deleted successfully"}

# 4. Update (For rating, changing status, updating episodes)
@app.put("/media/{media_id}", response_model=schemas.MediaResponse)
def update_media(media_id: int, media: schemas.MediaCreate, db: Session = Depends(get_db)):
    db_media = crud.update_media(db, media_id=media_id, media_update=media)
    if db_media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    return db_media