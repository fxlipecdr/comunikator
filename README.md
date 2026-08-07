# 🧩 Comunikator - App de Comunicação Aumentativa e Alternativa (CAA)

Aplicativo de CAA (Comunicação Aumentativa e Alternativa) voltado para crianças no espectro autista, desenvolvido com **React Native (Expo)**, **Python (FastAPI)** e **PostgreSQL**.

O projeto adota **Clean Architecture** e modelo **Offline-First**, garantindo que a Área da Criança funcione 100% desconectada da rede, com velocidade máxima, segurança, sem anúncios e sem rastreamento de dados (compliance LGPD/COPPA).

---

## 📌 Principais Recursos Implementados

### 👦 1. Área da Criança (Modo de Comunicação - 100% Offline)
- **Barra de Frases Interativa**: Montagem de frases em tempo real com botões de síntese de voz (🔊 Falar), limpeza (🗑️ Limpar) e salvamento de favoritos (⭐).
- **Prancha de Comunicação**: Grid responsivo com cartões divididos por categorias (*Necessidades, Sentimentos, Ações, Alimentos*).
- **Abas de Atalhos Rápidos (⭐ Favoritos)**: Permite salvar combinações de cartões para comunicação expressiva em 1 único toque.
- **Motor de Voz (TTS) Hibrido**: Suporte nativo a `Expo Speech` no celular (Android/iOS) e `Web Speech API` no navegador Web.
- **Efeitos Sonoros Positivos**: Estímulo tátil/auditivo (*Chimes*) ao selecionar cartões e tocar a frase.

### 👨‍👩‍👧 2. Área dos Pais (Modo de Edição & Monetização)
- **Portão Parental de Segurança**: Alternância entre **Desafio Matemático** e **PIN Numérico (1234)** para impedir acesso acidental da criança.
- **Gestor de Pranchas & Cartões**:
  - 📷 Captura de foto via câmera do dispositivo ou galeria (`expo-image-picker`).
  - 🗣️ Suporte a áudios de voz dos pais (`audioUri`) para substituir a voz sintética.
  - 🎨 Escolha de paleta de cores para cada aba de categoria.
  - Exclusão e edição de cartões/categorias.
- **Acessibilidade & Ajustes de Voz (TTS)**:
  - Controle de Velocidade da fala (0.6x Lento, 0.85x Recomendado, 1.0x Normal, 1.2x Rápido).
  - Controle do Tom/Pitch (Grave, Natural, Infantil/Agudo).
  - Seleção de Idioma (🇧🇷 `pt-BR`, 🇵🇹 `pt-PT`, 🇺🇸 `en-US`).
- **Tema Visual Anti-Fotofobia (Sensorial Suave)**:
  - Alternância entre **🌈 Tema Vibrante** e **🍃 Tema Sensorial Suave** (tons pastéis anti-sobrecarga visual).
- **📊 Relatório & Dashboard Analytics**:
  - Registro automático de uso no SQLite local.
  - Exibição de estatísticas e gráficos de frequência para fonoaudiólogos e terapeutas.
- **Monetização & Backup em Nuvem**:
  - Banner do **Google AdMob** condicionado a usuários gratuitos (`!isPremium`).
  - Integração Paywall com **RevenueCat** para assinatura do plano Premium.
  - Cliente HTTP de Sincronização em Nuvem (`SyncApiClient`) para backup no PostgreSQL.

---

## 🗂️ Estrutura do Projeto (Clean Architecture)

```
comunikator/
├── mobile/                           # Aplicação React Native (Expo)
│   ├── src/
│   │   ├── domain/                   # Entidades e Interfaces de Repositório
│   │   │   ├── entities/             # Category, Card, User, SpeechConfig, ThemeConfig, QuickPhrase, Analytics
│   │   │   ├── repositories/         # ICategoryRepository, ICardRepository
│   │   │   └── usecases/             # SyncCloudData
│   │   ├── infrastructure/           # Adaptadores e Drivers
│   │   │   ├── database/             # SQLite (sqliteClient, migrations, repositórios com fallbacks Web)
│   │   │   ├── speech/               # ExpoSpeechAdapter (TTS)
│   │   │   ├── monetization/         # AdMobService e RevenueCatService
│   │   │   └── api/                  # SyncApiClient (HTTP Client FastAPI)
│   │   └── presentation/             # Telas e Componentes React Native
│   │       ├── components/child/     # SentenceBar, CardTile, CategoryGrid
│   │       ├── components/parent/    # MathGateModal, AddCardModal, AddCategoryModal, VoiceSettingsModal, AnalyticsDashboardModal, AdMobBanner
│   │       └── screens/              # ChildCommunicationScreen, ParentSettingsScreen
│   ├── babel.config.js
│   ├── metro.config.js
│   ├── eas.json                      # Configuração de Build APK/iOS no EAS Cloud
│   └── package.json
│
└── backend/                          # API Python (FastAPI + PostgreSQL)
    ├── app/
    │   ├── models/database.py        # Mapeamento ORM SQLAlchemy
    │   └── main.py                   # Servidor FastAPI e Endpoints de Sync
    ├── scripts/schema.sql            # Script DDL PostgreSQL
    ├── Dockerfile                    # Containerização Docker
    ├── render.yaml                   # Deploy automático no Render.com
    └── requirements.txt
```

---

## 🏠 Como Continuar Desenvolvendo de Casa

### 1. Clonar ou Baixar as Atualizações
No seu computador de casa, abra o terminal na pasta do projeto e execute:
```bash
git pull --rebase origin main
```

### 2. Rodar o App Mobile no Computador de Casa

Navegue até a pasta `mobile`:
```bash
cd mobile
npm install
```

#### Para visualizar no Navegador Web:
```bash
npx expo start --web
```
> Acesse: `http://localhost:8081` ou `http://localhost:8082`

#### Para testar no Celular (Android / iPhone):
```bash
npx expo start --tunnel
```
> Baixe o app **Expo Go** no celular e escaneie o QR Code gerado no terminal.

### 3. Rodar o Backend Python de Casa

Navegue até a pasta `backend`:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
> Documentação interativa Swagger: `http://127.0.0.1:8000/docs`

---

## 🔄 Fluxo de Sincronização Automática
O projeto contém uma regra em `.agents/rules/git-sync.md` que faz o assistente rodar `git pull` ao iniciar e `git push` ao concluir alterações automaticamente.

**Repositório remoto GitHub**: [`https://github.com/fxlipecdr/comunikator.git`](https://github.com/fxlipecdr/comunikator.git) (Branch `main`).
