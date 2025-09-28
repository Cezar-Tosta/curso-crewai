
# **Problema no PDF e Melhora no CSS**

## 🙁 Problema:
Atualmente, ao clicar em **"Exportar PDF"**, o frontend faz uma **nova requisição para a API**, que **executa novamente todos os agentes** (pesquisa, planejamento, escrita, avaliação), **só para gerar o PDF**.
Isso é **ineficiente**, **caro** (em tokens e tempo) e **redundante**, pois o relatório já foi gerado anteriormente.
Vamos **corrigir isso** para que o PDF seja gerado **com base no relatório já existente**, **sem executar os agentes novamente**.
### ✅ Solução: Retornar o relatório em texto puro e usar no PDF

Vamos modificar o fluxo:

1. `/planejar_viagem` → Retorna o relatório em texto puro.
2. `/gerar_pdf` → Recebe o relatório como parâmetro e gera o PDF.

Mas como o frontend vai passar o relatório gerado para a rota de PDF?

### ✅ Opção mais prática: Rota de PDF local (no frontend)

**Melhor ideia**: Em vez de chamar `/gerar_pdf` novamente, **gere o PDF diretamente no frontend** com base no relatório que já está na tela.

---

### 🛠️ Passo 1: Atualize o `index.html` para gerar PDF localmente

Vamos adicionar uma biblioteca JavaScript chamada `jsPDF` para **gerar o PDF no navegador**.

#### 🔧 Adicione a biblioteca no `<head>` do `index.html`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
```

#### 🔧 Atualize o botão de exportar PDF:

Substitua o evento de clique do botão por:

```js
document.getElementById('export-pdf-btn').addEventListener('click', async () => {
    if (!document.getElementById('relatorio').textContent) {
        alert('Por favor, gere um relatório primeiro.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const relatorio = document.getElementById('relatorio').textContent;
    const dias = document.getElementById('dias').value;
    const orcamento = document.getElementById('orcamento').value;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório de Viagem Personalizado', 10, 10);
    doc.setFontSize(12);
    doc.text(`Itinerário para ${dias} dias com orçamento de US$${orcamento}`, 10, 20);

    // Adiciona o conteúdo do relatório (com quebra de linha)
    const lines = doc.splitTextToSize(relatorio, 180);
    doc.text(lines, 10, 30);

    doc.save(`relatorio_viagem_${dias}dias.pdf`);
});
```

#### ✅ Resultado:

- Ao clicar em **"Exportar PDF"**, o PDF é gerado **localmente**, sem chamar a API novamente.
- Mais rápido, mais barato e sem desperdício de execução de agentes.

---

### ✅ Código completo do `index.html` (atualizado)
- **Problema do PDF resolvido**
- **CSS melhorado**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Assistente de Viagem Inteligente</title>
    <style>
        :root {
            --primary: #4361ee;
            --primary-dark: #3a56d4;
            --secondary: #4cc9f0;
            --success: #4ade80;
            --danger: #f87171;
            --light: #f8fafc;
            --dark: #0f172a;
            --gray: #e2e8f0;
            --border: #cbd5e1;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
            color: var(--dark);
            line-height: 1.6;
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: var(--shadow);
            overflow: hidden;
        }

        header {
            background: linear-gradient(to right, var(--primary), var(--secondary));
            color: white;
            padding: 30px;
            text-align: center;
        }

        header h1 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .form-container {
            padding: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--dark);
        }

        input, select {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        input:focus, select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
        }

        .btn-group {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }

        button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        button[type="submit"] {
            background-color: var(--primary);
            color: white;
        }

        button[type="submit"]:hover {
            background-color: var(--primary-dark);
        }

        button#export-pdf-btn {
            background-color: #10b981;
            color: white;
        }

        button#export-pdf-btn:hover {
            background-color: #059669;
        }

        button:disabled {
            background-color: var(--gray);
            cursor: not-allowed;
        }

        #loading {
            display: none;
            text-align: center;
            padding: 20px;
            color: var(--primary);
            font-style: italic;
        }

        .loading-spinner {
            border: 4px solid rgba(67, 97, 238, 0.2);
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        #result-container {
            padding: 0 30px 30px;
        }

        .section {
            margin-bottom: 25px;
            background: var(--light);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: var(--shadow);
        }

        .section-title {
            background: var(--primary);
            color: white;
            padding: 14px 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .relatorio, .avaliacao {
            padding: 20px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 0.95rem;
            line-height: 1.7;
            white-space: pre-wrap;
            background: white;
            border-top: 1px solid var(--border);
        }

        .relatorio {
            background-color: #f0f9ff;
        }

        .avaliacao {
            background-color: #f0fdf4;
        }

        .error {
            background-color: #fef2f2;
            color: #dc2626;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #dc2626;
            margin-top: 20px;
        }

        footer {
            text-align: center;
            padding: 20px;
            color: #64748b;
            font-size: 0.9rem;
            border-top: 1px solid var(--border);
        }

        @media (max-width: 768px) {
            .btn-group {
                flex-direction: column;
            }

            button {
                width: 100%;
            }

            header, .form-container, #result-container {
                padding: 20px;
            }
        }
    </style>
    <!-- Bibliotecas para PDF -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
</head>
<body>

    <div class="container">
        <header>
            <h1>✈️ Assistente de Viagem Inteligente</h1>
            <p>Planeje sua próxima viagem com IA</p>
        </header>

        <div class="form-container">
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

                <div class="btn-group">
                    <button type="submit">Planejar Viagem</button>
                    <button type="button" id="export-pdf-btn" disabled>📄 Exportar PDF</button>
                </div>
            </form>

            <div id="loading">
                <div class="loading-spinner"></div>
                <p>Gerando seu relatório de viagem...</p>
            </div>
        </div>

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

        <footer>
            <p>Assistente de Viagem Inteligente com CrewAI • Feito com ❤️</p>
        </footer>
    </div>

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
                    exportBtn.disabled = false;
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

        // Botão de exportar PDF (gera localmente, com quebra de páginas)
        document.getElementById('export-pdf-btn').addEventListener('click', () => {
            if (!document.getElementById('relatorio').textContent) {
                alert('Por favor, gere um relatório primeiro.');
                return;
            }

            const { jsPDF } = window.jspdf;
            const relatorio = document.getElementById('relatorio').textContent;
            const dias = document.getElementById('dias').value;
            const orcamento = document.getElementById('orcamento').value;

            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text('Relatório de Viagem Personalizado', 10, 10);
            doc.setFontSize(12);
            doc.text(`Itinerário para ${dias} dias com orçamento de US$${orcamento}`, 10, 20);

            // Configuração para quebra de linhas e páginas
            const pageHeight = doc.internal.pageSize.height;
            const pageWidth = doc.internal.pageSize.width;
            const margin = 10;
            let yPosition = 30; // posição vertical inicial após os títulos

            // Divide o texto em linhas
            const lines = doc.splitTextToSize(relatorio, pageWidth - 2 * margin);

            lines.forEach((line) => {
                if (yPosition > pageHeight - 20) { // Se estiver perto do final da página
                    doc.addPage(); // Adiciona nova página
                    yPosition = 10; // Reinicia a posição vertical
                }
                doc.text(line, margin, yPosition);
                yPosition += 7; // Incrementa a posição vertical (altura da linha)
            });

            doc.save(`relatorio_viagem_${dias}dias.pdf`);
        });
    </script>

</body>
</html>
```

---

### ✅ Resultado

Agora:
- Ao clicar em **"Exportar PDF"**, o PDF é gerado **com base no relatório que já está na tela**.
- **Nenhum agente é executado novamente**.
- **Mais eficiente**, **mais rápido** e **sem desperdício de recursos**.

---

Se quiser manter a **rota `/gerar_pdf`** para uso futuro (ex: quando você quiser gerar PDFs mais complexos no backend), pode mantê-la no `api.py`, mas **não a usaremos mais no frontend**.