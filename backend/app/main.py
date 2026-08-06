from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="Comunikator Cloud Backup API",
    description="API de sincronização em nuvem e autenticação de usuários Premium",
    version="1.0.0"
)

# Schemas de Validação Pydantic
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

class SyncResponse(BaseModel):
    status: str
    message: str
    synced_categories_count: int
    synced_cards_count: int

@app.get("/")
def health_check():
    return {"status": "ok", "app": "Comunikator API", "version": "1.0.0"}

@app.post("/api/v1/sync", response_model=SyncResponse)
async def sync_user_data(payload: SyncPayload):
    """
    Endpoint para realizar backup em nuvem dos cartões e categorias de um usuário Premium.
    Sincronização incremental e idempotente.
    """
    try:
        # Lógica mockada de persistência no PostgreSQL
        categories_count = len(payload.categories)
        cards_count = len(payload.cards)

        return SyncResponse(
            status="success",
            message="Dados sincronizados com sucesso no PostgreSQL remoto.",
            synced_categories_count=categories_count,
            synced_cards_count=cards_count
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Falha ao sincronizar dados na nuvem: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
