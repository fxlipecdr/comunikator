# Regra de Instalação Automática de Dependências

Sempre que novas dependências forem adicionadas, modificadas ou necessárias nos arquivos `mobile/package.json` ou `backend/requirements.txt`:
1. Execute `npm install` na pasta `mobile/` automaticamente em segundo plano.
2. Execute `pip install -r requirements.txt` na pasta `backend/` automaticamente em segundo plano.
3. Não peça confirmação prévia para instalar pacotes; instale e prossiga com a tarefa.
