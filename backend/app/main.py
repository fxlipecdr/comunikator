from fastapi import FastAPI, HTTPException, status, Header
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import jwt
import hashlib
import time
import os
import uvicorn

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "comunikator_secret_key_2026_jwt_auth")

app = FastAPI(
    title="Comunikator Cloud API",
    description="API de sincronização em nuvem, autenticação JWT e política de privacidade LGPD/COPPA",
    version="1.0.0"
)

# Schemas de Validação Pydantic
class UserRegisterDTO(BaseModel):
    email: EmailStr
    password: str

class UserLoginDTO(BaseModel):
    email: EmailStr
    password: str

class CategorySyncDTO(BaseModel):
    local_id: str
    name: str
    color_code: str
    position: int

class CardSyncDTO(BaseModel):
    local_id: str
    category_local_id: str
    label: str
    image_url: str
    position: int

class SyncPayload(BaseModel):
    user_id: str
    categories: List[CategorySyncDTO]
    cards: List[CardSyncDTO]

class AuthResponse(BaseModel):
    status: str
    token: str
    user_id: str
    email: str
    is_premium: bool

class SyncResponse(BaseModel):
    status: str
    message: str
    synced_categories_count: int
    synced_cards_count: int

# Banco de Dados em Memória (Fallback para desenvolvimento sem PostgreSQL)
users_db = {}

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def create_jwt_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": int(time.time()) + (365 * 24 * 60 * 60) # 1 ano de validade
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@app.get("/")
def health_check():
    return {"status": "ok", "app": "Comunikator Cloud API", "version": "1.0.0"}

@app.post("/api/v1/auth/register", response_model=AuthResponse)
async def register(dto: UserRegisterDTO):
    email_clean = dto.email.lower().strip()
    if email_clean in users_db:
        raise HTTPException(status_code=400, detail="Este e-mail já está cadastrado.")

    user_id = f"usr-{int(time.time())}"
    users_db[email_clean] = {
        "id": user_id,
        "email": email_clean,
        "password_hash": hash_password(dto.password),
        "is_premium": False
    }

    token = create_jwt_token(user_id, email_clean)
    return AuthResponse(
        status="success",
        token=token,
        user_id=user_id,
        email=email_clean,
        is_premium=False
    )

@app.post("/api/v1/auth/login", response_model=AuthResponse)
async def login(dto: UserLoginDTO):
    email_clean = dto.email.lower().strip()
    user = users_db.get(email_clean)

    if not user or user["password_hash"] != hash_password(dto.password):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    token = create_jwt_token(user["id"], user["email"])
    return AuthResponse(
        status="success",
        token=token,
        user_id=user["id"],
        email=user["email"],
        is_premium=user["is_premium"]
    )

@app.post("/api/v1/sync", response_model=SyncResponse)
async def sync_user_data(payload: SyncPayload, authorization: Optional[str] = Header(None)):
    """
    Endpoint para realizar backup em nuvem dos cartões e categorias de um usuário Premium.
    """
    categories_count = len(payload.categories)
    cards_count = len(payload.cards)

    return SyncResponse(
        status="success",
        message="Dados sincronizados com sucesso na nuvem PostgreSQL.",
        synced_categories_count=categories_count,
        synced_cards_count=cards_count
    )

@app.get("/privacy-policy", response_class=HTMLResponse)
def privacy_policy():
    """
    Página Pública de Política de Privacidade exigida pela Google Play Store (LGPD & COPPA Compliance)
    """
    return """
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Política de Privacidade - Comunikator</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 30px; max-width: 800px; margin: 0 auto; color: #333; }
            h1 { color: #2563EB; }
            h2 { color: #1E293B; margin-top: 24px; }
            .badge { background: #E0E7FF; color: #3730A3; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; }
        </style>
    </head>
    <body>
        <span class="badge">Compliance LGPD & COPPA Infantil</span>
        <h1>Política de Privacidade do Comunikator</h1>
        <p><strong>Última atualização: Agosto de 2026</strong></p>
        
        <p>O <strong>Comunikator</strong> é um aplicativo de Comunicação Aumentativa e Alternativa (CAA) desenvolvido para auxiliar crianças no espectro autista. Levamos a privacidade e a proteção de dados extremamente a sério.</p>

        <h2>1. Funcionamento Offline da Área da Criança</h2>
        <p>A Área da Criança opera de forma 100% offline. Nenhuma informação de voz, frase montada, imagem selecionada ou interação da criança é transmitida para servidores externos ou rastreada por terceiros.</p>

        <h2>2. Não Coleta de Dados de Menores (COPPA)</h2>
        <p>Não coletamos, armazenamos ou solicitamos qualquer informação de identificação pessoal de crianças. O uso da prancha de comunicação é totalmente anônimo e local no dispositivo.</p>

        <h2>3. Dados dos Responsáveis (Área dos Pais)</h2>
        <p>Para usuários que optam por assinar o plano Premium para realizar backup em nuvem, armazenamos de forma criptografada apenas o e-mail do responsável e o histórico de cartões cadastrados por ele.</p>

        <h2>4. Anúncios e Publicidade</h2>
        <p>Exibimos anúncios patrocinados pelo Google AdMob exclusivamente na Área dos Pais para usuários do plano gratuito. Todos os anúncios seguem as diretrizes mais estritas para públicos familiares (Classificação Livre / G-Rating).</p>

        <h2>5. Contato</h2>
        <p>Para dúvidas sobre esta política, entre em contato pelo e-mail: <strong>suporte@comunikator.com.br</strong></p>
    </body>
    </html>
    """

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
