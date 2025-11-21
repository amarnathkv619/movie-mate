from sqlalchemy.orm import Session
import models, schemas

# 1 Get all movies/shows
def get_all_media(db: Session):
    return db.query(models.Media).all()

# 2 Get a single movie by ID
def get_media(db: Session, media_id: int):
    return db.query(models.Media).filter(models.Media.id == media_id).first()

# 3 Add a new movie/show
def create_media(db: Session, media: schemas.MediaCreate):
    db_media = models.Media(
        title=media.title,
        media_type=media.media_type,
        director=media.director,
        genre=media.genre,
        platform=media.platform,
        status=media.status,
        rating=media.rating,
        review=media.review,
        total_episodes=media.total_episodes,
        current_episode=media.current_episode  # <--- ADD THIS LINE
    )
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media

# 4 Delete a movie
def delete_media(db: Session, media_id: int):
    db_media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if db_media:
        db.delete(db_media)
        db.commit()
    return db_media

# 5 Update a movie (for progress, rating, etc.)
def update_media(db: Session, media_id: int, media_update: schemas.MediaCreate):
    db_media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if db_media:
        # Update only the fields that are sent
        for key, value in media_update.dict().items():
            setattr(db_media, key, value)
        db.commit()
        db.refresh(db_media)
    return db_media