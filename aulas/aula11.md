# 🧠 **Integração com Frontend: Conectando sua API a uma Interface Web**

---
## 📚 **Teoria (atualizada)**

Agora que sua API retorna **dois resultados**:
- `relatorio_viagem`
- `avaliacao`

Você pode **exibir os dois de forma clara e separada** no frontend, melhorando a experiência do usuário.

---

## 💻 **Exercícios (atualizados)**

1. Como você pode acessar o `relatorio_viagem` e `avaliacao` no frontend após a chamada da API?  
2. Qual é a vantagem de exibir os dois resultados separadamente?  
3. Como você pode estilizar cada um de forma diferente?

> **Gabarito**  
> 1. Acessando `data.relatorio_viagem` e `data.avaliacao` após o `await response.json()`.  
> 2. O usuário vê o relatório e a qualidade dele lado a lado, aumentando a confiança.  
> 3. Usando CSS diferente para cada div (ex: cores, bordas, fontes).

---

## 📌 **Resumo (atualizado)**

- Sua API agora retorna **dois resultados**: relatório e avaliação.
- O frontend pode **exibir os dois separadamente**.
- Isso melhora **clareza e confiança** no sistema.
- Use **CSS e HTML** para **formatar cada parte de forma distinta**.

---

## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 11:
**Crie a interface web para exibir relatório e avaliação separadamente.**

---

### ✅ `index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Assistente de Viagem Inteligente</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
        }
        input, select {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
        }
        button {
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            border: none;
            cursor: pointer;
        }
        button:disabled {
            background-color: #ccc;
        }
        #loading {
            display: none;
            margin-top: 10px;
            font-style: italic;
            color: #555;
        }
        #result-container {
            margin-top: 20px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .relatorio {
            background-color: #e8f4fd;
            padding: 15px;
            border-radius: 5px;
            white-space: pre-wrap;
        }
        .avaliacao {
            background-color: #f0f8e8;
            padding: 15px;
            border-radius: 5px;
            white-space: pre-wrap;
        }
        .error {
            background-color: #ffe8e8;
            padding: 15px;
            border-radius: 5px;
            color: #d00;
        }
    </style>
</head>
<body>

    <h1>Assistente de Viagem Inteligente</h1>
    <form id="travel-form">
        <div class="form-group">
            <label for="dias">Dias de viagem:</label>
            <input type="number" id="dias" value="7" min="1" max="30" required>
        </div>

        <div class="form-group">
            <label for="orcamento">Orçamento (USD):</label>
            <input type="number" id="orcamento" value="2000" min="100" required>
        </div>

        <div class="form-group">
            <label for="regiao">Região de interesse:</label>
            <select id="regiao" required>
                <option value="internacional">Internacional</option>
                <option value="Europa">Europa</option>
                <option value="América do Sul">América do Sul</option>
                <option value="Ásia">Ásia</option>
                <option value="Oceania">Oceania</option>
            </select>
        </div>

        <button type="submit">Planejar Viagem</button>
    </form>

    <div id="loading">Gerando seu relatório de viagem...</div>

    <div id="result-container" style="display: none;">
        <div id="relatorio-section" class="section">
            <div class="section-title">📄 Relatório de Viagem</div>
            <div id="relatorio" class="relatorio"></div>
        </div>

        <div id="avaliacao-section" class="section">
            <div class="section-title">🔍 Avaliação de Qualidade</div>
            <div id="avaliacao" class="avaliacao"></div>
        </div>
    </div>

    <div id="error" class="error" style="display: none;"></div>

    <script>
        document.getElementById('travel-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const dias = document.getElementById('dias').value;
            const orcamento = document.getElementById('orcamento').value;
            const regiao = document.getElementById('regiao').value;

            const loading = document.getElementById('loading');
            const resultContainer = document.getElementById('result-container');
            const relatorioDiv = document.getElementById('relatorio');
            const avaliacaoDiv = document.getElementById('avaliacao');
            const errorDiv = document.getElementById('error');

            // Limpa resultados anteriores
            relatorioDiv.textContent = '';
            avaliacaoDiv.textContent = '';
            errorDiv.style.display = 'none';
            resultContainer.style.display = 'none';

            loading.style.display = 'block';

            try {
                const response = await fetch('http://localhost:8000/planejar_viagem', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        dias: parseInt(dias),
                        orcamento_usd: parseInt(orcamento),
                        regiao_interesse: regiao
                    })
                });

                const data = await response.json();

                if (data.status === 'sucesso') {
                    relatorioDiv.textContent = data.relatorio_viagem;
                    avaliacaoDiv.textContent = data.avaliacao;
                    resultContainer.style.display = 'block';
                } else {
                    errorDiv.textContent = 'Erro: ' + data.mensagem;
                    errorDiv.style.display = 'block';
                }

            } catch (error) {
                errorDiv.textContent = 'Erro de conexão: ' + error.message;
                errorDiv.style.display = 'block';
            } finally {
                loading.style.display = 'none';
            }
        });
    </script>

</body>
</html>
```

---

### 🚀 Como testar

1. Execute sua API:
   ```bash
   uvicorn api:app --reload
   ```

2. Abra `index.html` no navegador.
3. Se der erro, tente:
	- Servir o HTML via um servidor local: `python -m http.server 8080`
	- Acesse: `http://localhost:8080/index.html`
4. Se ainda der problema, talvez seja necessário adicionar CORS ao `api.py`
	-  Instalar `pip install python-multipart`
	- Atualizar o código `api.py`
```python
# api.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ← adicione esta linha
from pydantic import BaseModel
from crewai import Crew
from travel_tasks import criar_tarefas_viagem

app = FastAPI(
    title="Assistente de Viagem com CrewAI",
    description="API para planejar viagens personalizadas usando agentes autônomos.",
    version="1.0.0"
)

# Adicione estas linhas para permitir requisições do frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir qualquer origem (use com cuidado em produção)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TravelRequest(BaseModel):
    dias: int = 7
    orcamento_usd: int = 2000
    regiao_interesse: str = "internacional"

@app.post("/planejar_viagem", summary="Planeja uma viagem personalizada")
def planejar_viagem(request: TravelRequest):
    """
    Recebe parâmetros da viagem e retorna um relatório completo e sua avaliação.
    """
    try:
        # Gera tarefas personalizadas com base nos inputs do usuário
        tasks = criar_tarefas_viagem(
            dias=request.dias,
            orcamento=request.orcamento_usd,
            regiao=request.regiao_interesse
        )

        # Extrai os agentes únicos das tarefas (evita repetição)
        agents = list({task.agent for task in tasks})

        # Cria e executa a Crew
        trip_crew = Crew(
            agents=agents,
            tasks=tasks,
            process="sequential",
            verbose=False  # Desativado para produção
        )

        # Executa a Crew
        trip_crew.kickoff()

        # Obtém os resultados de cada tarefa
        relatorio = tasks[2].output  # 3ª tarefa: Escrever Relatório
        avaliacao = tasks[3].output  # 4ª tarefa: Avaliar Relatório

        return {
            "status": "sucesso",
            "relatorio_viagem": str(relatorio),
            "avaliacao": str(avaliacao)
        }

    except Exception as e:
        return {
            "status": "erro",
            "mensagem": str(e)
        }
```

5. Preencha o formulário e clique em "Planejar Viagem".
6. Você verá:
   - **Relatório de Viagem** (em azul),
   - **Avaliação de Qualidade** (em verde).

---
### 📦 Estrutura final do projeto

```
seu_projeto/
├── .env
├── tools/
│   └── currency_converter_tool.py
├── travel_agents.py
├── travel_tasks.py
├── api.py                   
├── main.py
└── index.html              
```

---
Agora você tem uma **interface web completa** que se conecta à sua API CrewAI e exibe **dois resultados distintos** com estilo profissional.

#### COMPLEMENTO - O que é esse tal de CORS?
Claro! Vamos explicar **CORS** de forma simples, com um exemplo prático.

##### 🔐 **O que é CORS?**

**CORS** significa **Cross-Origin Resource Sharing** (Compartilhamento de Recursos de Origem Cruzada).

- **"Origem"** é a combinação de: protocolo (`http` ou `https`), domínio (`localhost`, `meusite.com`) e porta (`8000`, `3000`, etc).
- **"Cross-Origin"** significa que um site tenta acessar recursos de **outro domínio ou porta diferente**.
##### 🧠 Exemplo prático:

- Você acessa `http://localhost:8080/index.html` (frontend em HTML).
- Seu código JS tenta chamar `http://localhost:8000/planejar_viagem` (sua API).
- → **Origens diferentes**: `8080` vs `8000` → CORS bloqueia.

> ⚠️ O navegador **bloqueia automaticamente** chamadas entre origens diferentes **por segurança**, a menos que o servidor diga explicitamente:  
> *"Sim, estou permitindo que esse frontend me acesse."*

##### 🚫 Sem CORS:

- Frontend (8080) tenta chamar API (8000) → ❌ Bloqueado pelo navegador.
- Mensagem de erro: `Failed to fetch` ou `CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

##### ✅ Com CORS:

Você adiciona no seu `api.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← Permite qualquer origem (frontend)
    allow_credentials=True,
    allow_methods=["*"],  # ← Permite todos os métodos (GET, POST, etc)
    allow_headers=["*"],  # ← Permite todos os cabeçalhos
)
```

Agora:
- Frontend (8080) chama API (8000) → ✅ Sucesso!
- O navegador vê que a API respondeu: `"Sim, estou permitindo chamadas de qualquer origem."`

##### 🛡️ Importante:

- `allow_origins=["*"]` é **útil para desenvolvimento**, mas **não é seguro em produção**.
- Em produção, você deve especificar os domínios exatos que podem acessar sua API:

```python
allow_origins=["https://meusite.com", "https://app.meusite.com"]
```

##### ✅ Resumo:

| Situação | Comportamento                                          |
| -------- | ------------------------------------------------------ |
| Sem CORS | Frontend não consegue chamar a API → `Failed to fetch` |
| Com CORS | Frontend consegue chamar a API → ✅ Sucesso             |

---

CORS é uma **camada de segurança do navegador**, não da API. A API pode estar funcionando, mas o navegador **não permite** que seu frontend a acesse, **a menos que a API diga explicitamente que é permitido**.