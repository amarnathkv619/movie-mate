from sqlalchemy import Column, Integer, String, Float, Text
from database import Base

class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    media_type = Column(String)  # "Movie" or "Series"
    poster_url = Column(String, nullable=True)
    # Basic Info
    director = Column(String, nullable=True)
    genre = Column(String, nullable=True)
    platform = Column(String, nullable=True) # Netflix, Prime
    
    # Tracking
    status = Column(String, default="Wishlist") # Wishlist, Watching, Completed
    rating = Column(Float, nullable=True)       # 1 to 5 stars
    review = Column(Text, nullable=True)        # User notes
    
    # TV Show Specifics
    current_episode = Column(Integer, default=0)
    total_episodes = Column(Integer, nullable=True)