## 🧠 **Agentes com Acesso ao Google Drive**

---
## 📚 **Teoria**

### Por que agentes precisam de dados externos?

- **Conhecimento estático do LLM** é limitado (até a data de treinamento).
- Você pode querer que o agente responda com base em:
  - Documentos da sua empresa,
  - Dados de clientes,
  - Preços atualizados,
  - Itinerários antigos,
  - etc.

### Opções de integração:

1. **Leitura de arquivos do Google Drive**  
   → Útil para documentos, planilhas, PDFs, etc.

2. **Acesso a banco de dados**  
   → Para dados estruturados, como usuários, pedidos, estoque, etc.

---

## 💻 **Exercícios**

1. O que é um **embedder** e por que ele é útil ao ler arquivos?  
2. Qual é a diferença entre **leitura direta de arquivo** e **busca semântica**?  
3. Por que você deve usar **índices ou embeddings** ao acessar grandes volumes de dados?

> **Gabarito**  
> 1. Um **embedder** converte texto em vetores numéricos, permitindo busca semântica (por similaridade).  
> 2. **Leitura direta** lê tudo e procura, **busca semântica** encontra o que é mais relevante.  
> 3. Para **acelerar a busca** e evitar sobrecarga de processamento.

---

## 📌 **Resumo**

- Agentes podem acessar dados externos via **ferramentas personalizadas**.
- Use **índices vetoriais** para busca semântica em grandes volumes.
- **Google Drive** e **bancos de dados** exigem **autenticação e permissões**.

---

## 🌍 **Exemplo Real**

Uma empresa de turismo:
- Tem um **banco de dados** com preços de hotéis, voos, pacotes.
- Tem **documentos no Google Drive** com avaliações de clientes e dicas de viagem.
- Um agente acessa esses dados para responder:  
  *"Qual o melhor pacote para a Tailândia em janeiro?"*

---

## 🛠️ **Opções de Integração**

### 1. **Google Drive**

- Use a **API do Google Drive** para listar e baixar arquivos.
- Combine com **langchain** ou **crewai-tools** para leitura de PDF, DOCX, etc.
- Útil para documentos empresariais, manuais, etc.

### 2. **Banco de Dados**

- Acesse via **SQLAlchemy** (Python) ou bibliotecas específicas (ex: `psycopg2` para PostgreSQL).
- Útil para dados estruturados: usuários, pedidos, preços, etc.

---

## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 15:
**Criar um agente que leia arquivos de uma pasta do Google Drive**

Vamos criar uma **ferramenta personalizada** que:
- Acessa uma pasta do Google Drive,
- Lê arquivos (PDF, DOCX, TXT),
- Fornece o conteúdo para o agente.

---

### 🔧 Passo 1: Configurar acesso ao Google Drive

#### 1.1. Acesse o Google Cloud Console:
- Vá em: [https://console.cloud.google.com](https://console.cloud.google.com)
- Crie um novo projeto ou use um existente.
- Ative a **API do Google Drive**.

#### 1.2. Crie credenciais:
- Vá em **"Credentials"** → **"Create Credentials"** → **"Service Account"**.
- Baixe o arquivo JSON com as credenciais (ex: `credentials.json`).
- Compartilhe a pasta do Drive com o e-mail do service account.
	- 🧠 O que é um "service account"?
		- É uma **conta do Google** criada **pelo seu projeto no Google Cloud**.
		- Ela tem um **e-mail único** (ex: `meu-projeto@meu-projeto-123456.iam.gserviceaccount.com`).
		- Você vai **compartilhar sua pasta do Google Drive** com esse e-mail, para que ele possa **ler os arquivos**.
 - ✅ Passo a Passo: Como compartilhar a pasta do Drive com o service account
	1. **Abra o Google Drive**
		- Acesse [https://drive.google.com](https://drive.google.com)
		- Vá até a **pasta que você quer compartilhar** (ex: "Dados de Viagem").
	2. **Clique com o botão direito na pasta** → **"Compartilhar"**
	3. **Na caixa de "Convidar pessoas"**, cole o e-mail do service account
		- Exemplo de e-mail do service account: ```meu-projeto@meu-projeto-123456.iam.gserviceaccount.com```
		- Esse e-mail está no arquivo `credentials.json`, dentro do campo `"client_email"`.
	4. **Defina as permissões**
		- Escolha: **"Pode visualizar"** (ou "Can view")
		- Clique em **"Enviar"**
- ✅ Resultado
	- Seu agente terá **acesso à pasta do Drive**.
	- Ele pode ler arquivos e **usar essas informações para enriquecer o relatório**.
### 🔧 Passo 2: Instale as bibliotecas necessárias

```bash
pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
```

---

### 🔧 Passo 3: Crie uma ferramenta para ler arquivos do Google Drive

Crie um novo arquivo: `tools/drive_reader_tool.py`

```python
from crewai_tools import BaseTool
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import os

class DriveReaderTool(BaseTool):
    name: str = "Leitor de Arquivos do Google Drive"
    description: str = (
        "Lê arquivos de uma pasta específica do Google Drive e retorna o conteúdo. "
        "Use o ID da pasta do Google Drive."
    )

    def _run(self, folder_id: str) -> str:
        # Caminho para o arquivo de credenciais
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "credentials.json")

        # Autenticação
        creds = Credentials.from_service_account_file(creds_path)
        service = build('drive', 'v3', credentials=creds)

        # Listar arquivos na pasta
        results = service.files().list(
            q=f"'{folder_id}' in parents",
            fields="files(id, name, mimeType)"
        ).execute()

        files = results.get('files', [])
        content = []

        for file in files:
            file_id = file['id']
            file_name = file['name']
            mime_type = file['mimeType']

            # Lê o conteúdo do arquivo com base no tipo
            if mime_type == 'application/vnd.google-apps.document':
                # Lê documentos do Google Docs
                doc_content = service.files().export(fileId=file_id, mimeType='text/plain').execute()
                content.append(f"Documento: {file_name}\n{doc_content.decode('utf-8')}")
            elif mime_type == 'application/pdf':
                # Lê PDFs
                request = service.files().get_media(fileId=file_id)
                pdf_content = request.execute()
                content.append(f"PDF: {file_name}\nConteúdo não extraído (binário).")
            else:
                content.append(f"Arquivo: {file_name} (tipo: {mime_type})")

        return "\n\n".join(content)

    async def _arun(self, folder_id: str) -> str:
        raise NotImplementedError("Método assíncrono não suportado.")
```

---

### 🔧 Passo 4: Adicione ao seu `.env`

```env
OPENAI_API_KEY=sua_chave_openai
SERPER_API_KEY=sua_chave_serper
GOOGLE_APPLICATION_CREDENTIALS=credentials.json
```

---

### 🔧 Passo 5: Crie um agente que use a ferramenta

Adicione no seu `travel_agents.py`:

```python
from tools.drive_reader_tool import DriveReaderTool

# Ferramenta para ler arquivos do Drive
drive_tool = DriveReaderTool()

pesquisador_dados = Agent(
    role="Pesquisador de Dados de Viagem",
    goal="Buscar informações relevantes em documentos do Google Drive para enriquecer o relatório de viagem",
    backstory="Você tem acesso a uma pasta do Google Drive com avaliações, dicas e informações de viagens anteriores.",
    tools=[drive_tool],
    verbose=True
)
```

---

### 🔧 Passo 6: Crie uma tarefa que use essa ferramenta

Adicione no seu `travel_tasks.py`:

```python
from travel_agents import pesquisador_dados

pesquisar_dados_drive = Task(
    description=(
        "Considerando o relatório escrito pelo Escritor de Viagens, acesse a pasta do Google Drive com ID '1C3-...' e leia os documentos para complementar o relatório final. Utilize somente informações relevantes e coerentes com o contexto no país de viagem."
    ),
    expected_output="""O relatório foca em tais pontos...
    Com base nisso é importante mencionar que... 
    Se não houver nada relacionado, escrever "Nada a complementar.
    Mencione os arquivos consultados.""",
    agent=pesquisador_dados
)
```

---
### 🔧 Passo 7: atualização do `main.py`
```python
from crewai import Crew
from travel_agents import pesquisador_viagem, planejador_roteiros, escritor_viagens, avaliador_viagem, pesquisador_dados
from travel_tasks import pesquisar_destinos, planejar_itinerario, escrever_relatorio, avaliar_relatorio, pesquisar_dados_drive

if __name__ == "__main__":
    trip_crew = Crew(
        agents=[pesquisador_viagem, planejador_roteiros, escritor_viagens, avaliador_viagem, pesquisador_dados],
        tasks=[pesquisar_destinos, planejar_itinerario, escrever_relatorio, avaliar_relatorio, pesquisar_dados_drive],
        process='sequential',
        verbose=True
    )

    # Executa a Crew
    final_result = trip_crew.kickoff()

    # Acessa os resultados individuais
    relatorio_viagem = escrever_relatorio.output  # ← resultado do 3º agente
    avaliacao = avaliar_relatorio.output          # ← resultado do 4º agente (igual a final_result)
    dicas_finais = pesquisar_dados_drive.output   # ← resultado do 5º agente

    print("\n" + "="*50)
    print("📄 RELATÓRIO DE VIAGEM (3º agente)")
    print("="*50)
    print(relatorio_viagem)

    print("\n" + "="*50)
    print("🔍 AVALIAÇÃO DE QUALIDADE (4º agente)")
    print("="*50)
    print(avaliacao)

    print("\n" + "="*50)
    print("🔍 DICAS FINAIS com base no DRIVE (5º agente)")
    print("="*50)
    print(dicas_finais)
```

### Passo 8: ajustar a tarefa com base no ID da pasta
- O **ID da pasta** é uma string única que identifica a pasta no Google Drive. Ele está **na URL** quando você acessa a pasta.
- Exemplo: ```https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0jklmnopqrstuv```
- O ID da pasta é a parte após `folders/`
- Script `test_drive.py` para testar a conexão com a pasta:
```python
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import os

# Caminho para o arquivo de credenciais
creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "credentials.json")

# Autenticação
creds = Credentials.from_service_account_file(creds_path)
service = build('drive', 'v3', credentials=creds)

# Teste: liste as pastas
results = service.files().list(
    q="mimeType='application/vnd.google-apps.folder'",
    fields="files(id, name)"
).execute()

files = results.get('files', [])

if not files:
    print("Nenhuma pasta encontrada.")
else:
    print("Pastas encontradas:")
    for file in files:
        print(f"Nome: {file['name']}, ID: {file['id']}")
```

### ✅ Resultado

Agora seu agente pode:
- Ler arquivos do Google Drive,
- Incorporar essas informações no relatório,
- Fazer buscas semânticas (com adaptações futuras),
- Acessar dados internos da sua empresa.