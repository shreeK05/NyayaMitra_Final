"""
SQLAlchemy ORM models for NyayaMitra.
All user data is stored encrypted (DPDP Act compliance).
Uses String(36) UUIDs for SQLite/PostgreSQL compatibility in dev.
"""
from datetime import datetime
from typing import Optional
import uuid
from sqlalchemy import (
    String, Text, DateTime, Boolean, Float, Integer,
    ForeignKey, JSON, Enum as SAEnum
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
import enum


class Language(str, enum.Enum):
    hi = "hi"
    mr = "mr"
    ta = "ta"
    bn = "bn"
    te = "te"
    en = "en"


class CaseStatus(str, enum.Enum):
    active = "active"
    pending = "pending"
    resolved = "resolved"
    limitation_expired = "limitation_expired"


class DocumentStatus(str, enum.Enum):
    draft = "draft"
    generated = "generated"
    timestamped = "timestamped"
    sent = "sent"


# ──────────────────────────────────────────────
# User
# ──────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone_hash: Mapped[Optional[str]] = mapped_column(String(64), unique=True, index=True)
    email_hash: Mapped[Optional[str]] = mapped_column(String(64), unique=True, index=True)
    state: Mapped[str] = mapped_column(String(64), default="Maharashtra")
    preferred_language: Mapped[str] = mapped_column(SAEnum(Language), default=Language.hi)
    whatsapp_opted_in: Mapped[bool] = mapped_column(Boolean, default=False)
    fcm_token: Mapped[Optional[str]] = mapped_column(String(512))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    cases: Mapped[list["Case"]] = relationship("Case", back_populates="user", lazy="select")
    documents: Mapped[list["GeneratedDocument"]] = relationship("GeneratedDocument", back_populates="user", lazy="select")
    conversations: Mapped[list["Conversation"]] = relationship("Conversation", back_populates="user", lazy="select")
    amendment_subscriptions: Mapped[list["AmendmentSubscription"]] = relationship("AmendmentSubscription", back_populates="user", lazy="select")


# ──────────────────────────────────────────────
# Conversation (Voice Counsellor)
# ──────────────────────────────────────────────
class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    language: Mapped[str] = mapped_column(SAEnum(Language), default=Language.hi)
    summary_encrypted: Mapped[Optional[str]] = mapped_column(Text)  # AES-256-GCM encrypted
    emotion_score: Mapped[Optional[float]] = mapped_column(Float)    # 0.0=calm, 1.0=distressed
    case_type_detected: Mapped[Optional[str]] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="conversations")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="conversation", order_by="Message.created_at", lazy="select")


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id: Mapped[str] = mapped_column(ForeignKey("conversations.id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(String(16))   # user | assistant
    content_encrypted: Mapped[str] = mapped_column(Text)  # AES-256-GCM
    retrieved_sections: Mapped[Optional[list]] = mapped_column(JSON)
    win_probability: Mapped[Optional[float]] = mapped_column(Float)
    confidence_score: Mapped[Optional[float]] = mapped_column(Float)
    emotion_detected: Mapped[Optional[str]] = mapped_column(String(32))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="messages")


# ──────────────────────────────────────────────
# Case Tracker
# ──────────────────────────────────────────────
class Case(Base):
    __tablename__ = "cases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(256))
    case_type: Mapped[str] = mapped_column(String(64))
    status: Mapped[str] = mapped_column(SAEnum(CaseStatus), default=CaseStatus.active)
    facts_encrypted: Mapped[Optional[str]] = mapped_column(Text)    # AES-256-GCM
    acts_relevant: Mapped[Optional[list]] = mapped_column(JSON)
    limitation_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    next_step: Mapped[Optional[str]] = mapped_column(Text)
    nyaya_score_impact: Mapped[Optional[float]] = mapped_column(Float)
    ecourts_case_no: Mapped[Optional[str]] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="cases")
    timeline_events: Mapped[list["TimelineEvent"]] = relationship("TimelineEvent", back_populates="case", lazy="select")
    documents: Mapped[list["GeneratedDocument"]] = relationship("GeneratedDocument", back_populates="case", lazy="select")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(ForeignKey("cases.id", ondelete="CASCADE"), index=True)
    label: Mapped[str] = mapped_column(String(256))
    description: Mapped[Optional[str]] = mapped_column(Text)
    event_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    is_done: Mapped[bool] = mapped_column(Boolean, default=False)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    case: Mapped["Case"] = relationship("Case", back_populates="timeline_events")


# ──────────────────────────────────────────────
# Document Generator
# ──────────────────────────────────────────────
class GeneratedDocument(Base):
    __tablename__ = "generated_documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    case_id: Mapped[Optional[str]] = mapped_column(ForeignKey("cases.id", ondelete="SET NULL"), index=True)
    doc_type: Mapped[str] = mapped_column(String(64))
    title: Mapped[str] = mapped_column(String(256))
    content_encrypted: Mapped[str] = mapped_column(Text)   # AES-256-GCM
    form_data: Mapped[Optional[dict]] = mapped_column(JSON)
    language: Mapped[str] = mapped_column(SAEnum(Language), default=Language.hi)
    status: Mapped[str] = mapped_column(SAEnum(DocumentStatus), default=DocumentStatus.draft)
    blockchain_tx_hash: Mapped[Optional[str]] = mapped_column(String(128))
    blockchain_timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime)
    ipfs_hash: Mapped[Optional[str]] = mapped_column(String(128))
    pdf_url: Mapped[Optional[str]] = mapped_column(String(512))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="documents")
    case: Mapped[Optional["Case"]] = relationship("Case", back_populates="documents")


# ──────────────────────────────────────────────
# Amendment Tracker
# ──────────────────────────────────────────────
class LawAmendment(Base):
    __tablename__ = "law_amendments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    act_name: Mapped[str] = mapped_column(String(256), index=True)
    section: Mapped[str] = mapped_column(String(64))
    old_text: Mapped[Optional[str]] = mapped_column(Text)
    new_text: Mapped[str] = mapped_column(Text)
    diff_summary: Mapped[str] = mapped_column(Text)
    gazette_date: Mapped[datetime] = mapped_column(DateTime, index=True)
    gazette_number: Mapped[Optional[str]] = mapped_column(String(64))
    gazette_url: Mapped[Optional[str]] = mapped_column(String(512))
    category: Mapped[Optional[str]] = mapped_column(String(64))  # criminal | civil | labour | consumer
    is_ipc_bns_mapping: Mapped[bool] = mapped_column(Boolean, default=False)
    ipc_section: Mapped[Optional[str]] = mapped_column(String(32))
    bns_section: Mapped[Optional[str]] = mapped_column(String(32))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    subscriptions: Mapped[list["AmendmentSubscription"]] = relationship("AmendmentSubscription", back_populates="amendment", lazy="select")


class AmendmentSubscription(Base):
    __tablename__ = "amendment_subscriptions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    amendment_id: Mapped[Optional[str]] = mapped_column(ForeignKey("law_amendments.id", ondelete="SET NULL"))
    act_keywords: Mapped[Optional[list]] = mapped_column(JSON)   # ['labour', 'wages'] etc.
    notified_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    channel: Mapped[str] = mapped_column(String(16), default="whatsapp")  # whatsapp | fcm

    user: Mapped["User"] = relationship("User", back_populates="amendment_subscriptions")
    amendment: Mapped[Optional["LawAmendment"]] = relationship("LawAmendment", back_populates="subscriptions")


# ──────────────────────────────────────────────
# NyayaScore
# ──────────────────────────────────────────────
class NyayaScore(Base):
    __tablename__ = "nyaya_scores"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)
    total_score: Mapped[float] = mapped_column(Float, default=0.0)
    employment_score: Mapped[float] = mapped_column(Float, default=0.0)
    tenancy_score: Mapped[float] = mapped_column(Float, default=0.0)
    consumer_score: Mapped[float] = mapped_column(Float, default=0.0)
    personal_safety_score: Mapped[float] = mapped_column(Float, default=0.0)
    document_readiness_score: Mapped[float] = mapped_column(Float, default=0.0)
    issues: Mapped[Optional[list]] = mapped_column(JSON)
    computed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
