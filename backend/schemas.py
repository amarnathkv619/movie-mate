from pydantic import BaseModel
from typing import Optional


class MediaBase(BaseModel):
    title: str
    media_type: str  # "Movie" or "Series"
    director: Optional[str] = None
    genre: Optional[str] = None
    platform: Optional[str] = None
    status: str = "Wishlist"
    rating: Optional[float] = None
    review: Optional[str] = None
    total_episodes: Optional[int] = None


class MediaCreate(MediaBase):
    pass

class MediaResponse(MediaBase):
    id: int
    current_episode: int

    class Config:
        from_attributes = True