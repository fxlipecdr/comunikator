# Regra de Sincronização Automática via Git (Work & Home Sync)

Esta regra instrui a IA assistente (Antigravity) a manter o repositório sincronizado entre a máquina do trabalho e a máquina de casa automaticamente.

## Diretrizes de Execução

1. **Início da Conversa (Sincronização de Entrada)**:
   - Ao iniciar qualquer atendimento nesta área de trabalho, verifique o status do Git com `git status`.
   - Se um repositório remoto estiver configurado (`origin`), execute `git pull --rebase` silenciosamente antes de analisar ou modificar arquivos, para garantir que as alterações feitas na outra máquina sejam carregadas.

2. **Término da Alteração (Sincronização de Saída)**:
   - Sempre que concluir um conjunto de alterações, criação de arquivos ou correção no código:
     1. Execute `git status` para verificar os arquivos modificados.
     2. Execute `git add .`
     3. Faça o commit com uma mensagem concisa e descritiva em português (ex: `git commit -m "feat/fix: ..."`)
     4. Execute `git push` caso um controle remoto (`origin`) esteja configurado.
   - Informe brevemente ao usuário o status do commit e push realizado.
