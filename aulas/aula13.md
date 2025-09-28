# 🧠 **Deploy da API em Nuvem — Tornando seu Projeto Acessível Publicamente**

---
## 📚 **Teoria**

### Por que fazer deploy?

Até agora, seu projeto roda **apenas no seu computador**:
- Acessado via `http://localhost:8000`
- Funciona só quando você está com o servidor ligado

Fazer **deploy** significa:
- Hospedar seu código em um **servidor público**
- Permitir que **qualquer pessoa** acesse sua API
- Ter um **endereço web real** (ex: `https://meuprojeto.onrender.com`)

---

## 💻 **Exercícios**

1. O que muda quando você faz deploy da API?  
2. Por que você não deve colocar chaves de API no código?  
3. O que é uma variável de ambiente?

> **Gabarito**  
> 1. O código passa a rodar em um servidor remoto, acessível via URL pública.  
> 2. Porque o código pode ser visto por outros, expondo credenciais.  
> 3. É uma variável que o sistema operacional ou provedor de nuvem fornece para armazenar dados sensíveis (como chaves de API).

---

## 📌 **Resumo**

- Deploy torna sua API **acessível publicamente**.
- Use variáveis de ambiente para **proteger chaves de API**.
- Escolha um provedor de nuvem como **Render**, **Railway**, ou **PythonAnywhere**.

---

## 🌍 **Exemplo Real**

Uma startup de turismo:
- Hospedou a API em `https://api.viagens.com`
- O frontend (site) chama a API para gerar roteiros
- Milhares de usuários acessam diariamente

---

## 🛠️ **Opções de Deploy Simples**

### 1. **Render.com** (recomendado)
- Gratuito para projetos pequenos
- Integração direta com GitHub
- Suporta FastAPI e Python

### 2. **Railway.app**
- Interface amigável
- Fácil configuração de variáveis de ambiente

### 3. **PythonAnywhere**
- Focado em Python
- Ideal para iniciantes

---

## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 13:
**Preparar seu projeto para deploy no Render.com**

#### Passo 1: Estrutura do projeto para deploy

Crie um arquivo `requirements.txt` com as dependências:

```
fastapi
uvicorn[standard]
crewai
crewai-tools
python-dotenv
weasyprint
```

> ⚠️ **Atenção**: `weasyprint` pode exigir pacotes adicionais no servidor. Vamos ver isso mais adiante.

---

#### Passo 2: Crie um arquivo `Procfile` (para o Render)

```
web: uvicorn api:app --host 0.0.0.0 --port $PORT
```

> `$PORT` é uma variável que o Render fornece.

---

#### Passo 3: Atualize o `api.py` para usar variáveis de ambiente

Adicione no início do arquivo:

```python
import os
from dotenv import load_dotenv

load_dotenv()  # Carrega variáveis locais (se existirem)
```

E remova o `load_dotenv()` duplicado, se houver.

---

#### Passo 4: Adicione CORS (caso o frontend não esteja hospedado junto)

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ajuste isso para o domínio do seu frontend em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

#### Passo 5: Arquivos necessários para deploy

```
seu_projeto/
├── api.py
├── travel_agents.py
├── travel_tasks.py
├── tools/
│   └── currency_converter_tool.py
├── index.html
├── requirements.txt
├── Procfile
└── .env (não inclua no repositório!)
```

> ⚠️ **Importante**: **Nunca suba o `.env` para o GitHub!**  
> Adicione no `.gitignore`:
> ```
> .env
> ```

---

#### Passo 6: Como fazer o deploy no Render

1. Crie uma conta em [https://render.com](https://render.com)
2. Conecte sua conta do GitHub
3. Crie um novo **Web Service**
4. Escolha seu repositório
5. Escolha **Environment: Python**
6. Escolha o **Build Command**:
   ```
   pip install -r requirements.txt
   ```
7. Escolha o **Start Command**:
   ```
   uvicorn api:app --host 0.0.0.0 --port $PORT
   ```
8. Adicione as variáveis de ambiente:
   - `OPENAI_API_KEY`
   - `SERPER_API_KEY`
9. Clique em **Deploy**

---

### 🧠 Dica: Problemas com `weasyprint` no Render

`weasyprint` exige pacotes de sistema (como Cairo). O Render não os tem por padrão.  
**Soluções**:

1. **Opcional**: Remova a rota `/gerar_pdf` do deploy e deixe só para uso local.
2. **Avançado**: Use uma imagem Docker personalizada com os pacotes necessários.
3. **Alternativa**: Use `reportlab` ou `pdfkit` (mais leves).

---

### ✅ Resultado esperado

- Sua API estará disponível em: `https://<seu-projeto>.onrender.com`
- Acesse `/docs` para ver a interface da API
- Acesse `/` para ver o frontend
- Pode chamar `/planejar_viagem` de qualquer lugar

---

### 💡 Dica final: Teste com Postman ou curl

Após o deploy, teste com:

```bash
curl -X POST https://<seu-projeto>.onrender.com/planejar_viagem \
  -H "Content-Type: application/json" \
  -d '{"dias": 7, "orcamento_usd": 2000, "regiao_interesse": "Europa"}'
```
