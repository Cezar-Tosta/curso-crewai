# 🧠 **Exportando Resultados em PDF e Melhorando a Experiência do Usuário**

---
## **Mas antes...**
Arquivo `api.py` com a rota para exibir o `index.html` (**localhost:8000**):
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
from crewai import Crew
from travel_tasks import criar_tarefas_viagem
from fastapi.responses import HTMLResponse

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

@app.get("/", response_class=HTMLResponse)
def read_root():
    with open("index.html", encoding="utf-8") as f:
        return HTMLResponse(f.read())

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
## 📚 **Teoria**

### Por que exportar para PDF?
- **Profissionalismo**: o usuário pode salvar, imprimir ou compartilhar o relatório como um documento oficial.
- **Layout controlado**: você pode formatar o relatório com estilos, fontes, imagens e seções bem definidas.
- **Portabilidade**: PDF é universal — funciona em qualquer dispositivo e sistema operacional.

### Como gerar PDFs em Python?
Existem várias bibliotecas:
- `reportlab`: mais controle e flexibilidade.
- `weasyprint`: converte HTML/CSS para PDF.
- `pdfkit`: baseado no `wkhtmltopdf` (requer instalação externa).

> Neste curso, usaremos `weasyprint`, por ser mais simples e permitir usar HTML como base para o PDF.

---

## 💻 **Exercícios**

1. Qual biblioteca vamos usar nesse curso que converte HTML/CSS em PDF?  
2. Por que é melhor gerar PDF do que entregar texto puro?  
3. Como você pode adicionar um botão no frontend para baixar o PDF?

> **Gabarito**  
> 1. `weasyprint`  
> 2. PDF tem layout fixo, é portável e mais profissional.  
> 3. Convertendo o HTML do relatório em PDF e enviando como resposta com `Content-Disposition: attachment`.

---

## 📌 **Resumo**

- PDF melhora a **apresentação e portabilidade** do relatório.
- `weasyprint` é uma boa opção para converter HTML em PDF com estilo.
- Você pode adicionar uma rota `/gerar_pdf` que recebe o relatório e retorna um arquivo PDF.

---

## 🌍 **Exemplo Real**

Uma agência de turismo entrega o roteiro em PDF com:
- Capa personalizada,
- Itinerário por dia,
- Mapas,
- Links e dicas.

O cliente pode salvar e usar offline durante a viagem.

---

## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 12:
**Adicione uma rota na sua API para gerar o relatório de viagem em PDF.**

#### Passo 1: Instale `weasyprint`

```bash
pip install weasyprint
```

> ⚠️ No Linux ou macOS, você pode precisar instalar o `Cairo` e `Pango`:
> ```bash
> # Ubuntu/Debian
> sudo apt-get install build-essential libpango1.0-dev libharfbuzz-dev libgdk-pixbuf2.0-dev libffi-dev libcairo2-dev
> ```

#### Passo 2: Atualize `api.py`

Adicione uma nova rota `/gerar_pdf`:

```python
# api.py

from fastapi import FastAPI
from fastapi.responses import HTMLResponse, StreamingResponse
from pydantic import BaseModel
from crewai import Crew
from travel_tasks import criar_tarefas_viagem
from weasyprint import HTML, CSS
from io import BytesIO

app = FastAPI(
    title="Assistente de Viagem com CrewAI",
    description="API para planejar viagens personalizadas usando agentes autônomos.",
    version="1.0.0"
)

# Rota para servir o index.html
@app.get("/", response_class=HTMLResponse)
def read_root():
    with open("index.html", encoding="utf-8") as f:
        return HTMLResponse(f.read())

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
        tasks = criar_tarefas_viagem(
            dias=request.dias,
            orcamento=request.orcamento_usd,
            regiao=request.regiao_interesse
        )

        agents = list({task.agent for task in tasks})

        trip_crew = Crew(
            agents=agents,
            tasks=tasks,
            process="sequential",
            verbose=False
        )

        trip_crew.kickoff()

        relatorio = tasks[2].output
        avaliacao = tasks[3].output

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

@app.post("/gerar_pdf", summary="Gera o relatório de viagem em PDF")
def gerar_pdf(request: TravelRequest):
    """
    Recebe os mesmos dados e retorna um PDF com o relatório.
    """
    try:
        tasks = criar_tarefas_viagem(
            dias=request.dias,
            orcamento=request.orcamento_usd,
            regiao=request.regiao_interesse
        )

        agents = list({task.agent for task in tasks})

        trip_crew = Crew(
            agents=agents,
            tasks=tasks,
            process="sequential",
            verbose=False
        )

        trip_crew.kickoff()

        relatorio = tasks[2].output

        # Formata o relatório em HTML com CSS
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Relatório de Viagem</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    line-height: 1.6;
                }}
                h1 {{
                    color: #2c3e50;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 10px;
                }}
                .section {{
                    margin: 20px 0;
                }}
            </style>
        </head>
        <body>
            <h1>Relatório de Viagem Personalizado</h1>
            <div class="section">
                <h2>Itinerário para {request.dias} dias com orçamento de US${request.orcamento_usd}</h2>
                <pre>{relatorio}</pre>
            </div>
            <p><small>Gerado por Assistente de Viagem Inteligente com CrewAI</small></p>
        </body>
        </html>
        """

        # Gera o PDF
        html = HTML(string=html_content)
        css = CSS(string="""
            @page {{
                margin: 1cm;
            }}
            pre {{
                white-space: pre-wrap;
            }}
        """)
        pdf_bytes = html.write_pdf(stylesheets=[css])

        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=relatorio_viagem_{request.dias}dias.pdf"
            }
        )

    except Exception as e:
        return {
            "status": "erro",
            "mensagem": str(e)
        }
```

#### Passo 3: Teste a nova rota
- Execute o código: `uvicorn api:app --reload`
- Acesse:
👉 http://localhost:8000/docs  
- Vá até `/gerar_pdf`, clique em "Try it out", preencha os dados e execute.

Você receberá um **arquivo PDF baixável** com o relatório formatado.

---

### ✅ Resultado esperado

Agora você tem:
- `/planejar_viagem` → Retorna JSON com relatório e avaliação.
- `/gerar_pdf` → Retorna um PDF com o relatório formatado.

---

### 💡 Integrando com o Front-end
Perfeito! Agora vamos integrar a funcionalidade de **exportar em PDF** com o **frontend**, adicionando um botão que **gera e faz download do PDF automaticamente**.

#### ✅ O que vamos fazer?

- Adicionar um botão no `index.html` chamado **"Exportar PDF"**.
- Quando o usuário clicar, o frontend:
  - Pega os dados do formulário,
  - Chama a rota `/gerar_pdf`,
  - Recebe o PDF e **faz download automaticamente**.

#### 🛠️ Passo 1: Atualizar o `index.html`

Adicione um botão para exportar PDF logo após o formulário:

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
            margin-right: 10px;
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
        <button type="button" id="export-pdf-btn" disabled>Exportar PDF</button>
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
            const exportBtn = document.getElementById('export-pdf-btn');

            // Limpa resultados anteriores
            relatorioDiv.textContent = '';
            avaliacaoDiv.textContent = '';
            errorDiv.style.display = 'none';
            resultContainer.style.display = 'none';

            loading.style.display = 'block';

            try {
                const response = await fetch('/planejar_viagem', {
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
                    exportBtn.disabled = false; // Habilita o botão de exportar
                    // Armazena os dados para usar no PDF
                    window.currentFormData = { dias, orcamento, regiao };
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

        // Botão de exportar PDF
        document.getElementById('export-pdf-btn').addEventListener('click', async () => {
            if (!window.currentFormData) {
                alert('Por favor, gere um relatório primeiro.');
                return;
            }

            const { dias, orcamento, regiao } = window.currentFormData;

            try {
                const response = await fetch('/gerar_pdf', {
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

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `relatorio_viagem_${dias}dias.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } else {
                    alert('Erro ao gerar PDF.');
                }
            } catch (error) {
                alert('Erro de conexão ao gerar PDF: ' + error.message);
            }
        });
    </script>

</body>
</html>
```

#### ✅ O que mudou?

- Adicionado o botão **"Exportar PDF"**, desabilitado por padrão.
- Quando o relatório é gerado com sucesso, o botão é **habilitado**.
- O botão chama a rota `/gerar_pdf` com os mesmos dados do formulário.
- O PDF é **recebido como blob** e **faz download automaticamente**.
#### 🧪 Como testar?

1. Acesse `http://localhost:8000`.
2. Preencha o formulário e clique em **"Planejar Viagem"**.
3. Após o relatório aparecer, clique em **"Exportar PDF"**.
4. O PDF deve ser baixado automaticamente.

#### 💡 Dica: O que é `blob`?

- Um **blob** é um objeto que representa **dados binários** (como PDF, imagem, etc.).
- O navegador pode **converter em URL temporária** para download.
---
Agora seu frontend está **completo**:
- Gera relatório,
- Exibe relatório e avaliação,
- Exporta em PDF com um clique.
