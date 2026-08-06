-- Script SQL para criação do banco de dados PostgreSQL do Comunikator Backend
-- Habilita a extensão UUID caso ainda não esteja ativa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários (Responsáveis)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE NOT NULL,
    revenuecat_app_user_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias Sincronizadas do Usuário Premium
CREATE TABLE IF NOT EXISTS user_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    local_id VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    color_code VARCHAR(30) NOT NULL DEFAULT '#4A90E2',
    position INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, local_id)
);

-- Tabela de Cartões Sincronizados do Usuário Premium
CREATE TABLE IF NOT EXISTS user_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_local_id VARCHAR(255) NOT NULL,
    local_id VARCHAR(255) NOT NULL,
    label VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    position INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, local_id)
);

-- Índices de Alta Performance para buscas relacionais por usuário
CREATE INDEX IF NOT EXISTS idx_user_categories_user ON user_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_user_cat ON user_cards(user_id, category_local_id);
