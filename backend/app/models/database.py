import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Text, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_premium = Column(Boolean, default=False, nullable=False)
    revenuecat_app_user_id = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    categories = relationship("UserCategory", back_populates="user", cascade="all, delete-orphan")
    cards = relationship("UserCard", back_populates="user", cascade="all, delete-orphan")


class UserCategory(Base):
    __tablename__ = 'user_categories'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    local_id = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    color_code = Column(String(30), default='#4A90E2', nullable=False)
    position = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="categories")

    __table_args__ = (
        UniqueConstraint('user_id', 'local_id', name='uq_user_category_local_id'),
    )


class UserCard(Base):
    __tablename__ = 'user_cards'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    category_local_id = Column(String(255), nullable=False)
    local_id = Column(String(255), nullable=False)
    label = Column(String(100), nullable=False)
    image_url = Column(Text, nullable=False)
    position = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="cards")

    __table_args__ = (
        UniqueConstraint('user_id', 'local_id', name='uq_user_card_local_id'),
    )
