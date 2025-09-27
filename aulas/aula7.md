# 🧠 **Criando Ferramentas Personalizadas**

---
## 📚 **Teoria**

### Por que criar ferramentas personalizadas?
As ferramentas prontas (como `SerperDevTool`) são ótimas, mas muitas vezes você precisa de:
- Acesso a uma **API interna**,
- Leitura de um **formato de arquivo específico**,
- **Lógica de negócio personalizada** (ex: cálculo de orçamento com taxas locais),
- Integração com um **banco de dados** ou sistema legado.

O CrewAI permite criar ferramentas **totalmente customizadas** usando a classe base `BaseTool`.

### Como criar uma ferramenta personalizada?
1. Crie uma classe que herda de `BaseTool`.
2. Defina:
   - `name`: nome da ferramenta (usado pelo LLM para decidir quando usá-la),
   - `description`: o que ela faz (em linguagem clara para o LLM),
   - o método `__call__` ou `run`: a lógica real da ferramenta.

> 💡 Dica: Você também pode usar o decorador `@tool` para criar ferramentas rapidamente a partir de funções.

---

## 💻 **Exercícios**

1. Qual classe base você deve herdar para criar uma ferramenta personalizada?  
2. Onde o LLM "vê" a descrição da ferramenta?  
3. É possível criar uma ferramenta que **não faça requisições externas**, só processe dados?

> **Gabarito**  
> 1. `BaseTool` (de `crewai.tools`).  
> 2. Na propriedade `description` da ferramenta — o CrewAI injeta isso no prompt do agente.  
> 3. Sim! Ferramentas podem ser puramente lógicas (ex: converter moedas, formatar texto, calcular dias úteis).

---

## 📌 **Resumo**

- Ferramentas personalizadas dão **flexibilidade total** ao seu agente.
- Use `BaseTool` para controle avançado ou `@tool` para simplicidade.
- A `description` é **crucial**: ela orienta o LLM sobre **quando e como usar** a ferramenta.
- Ferramentas podem acessar APIs, arquivos, bancos ou só executar lógica local.

---

## 🌍 **Exemplo Real**

Uma fintech criou uma ferramenta chamada `TaxCalculatorTool` que:
- Recebe país, valor e tipo de serviço,
- Consulta uma tabela interna de impostos,
- Retorna o valor total com taxas.

O agente de suporte usa essa ferramenta para dar **orçamentos precisos em tempo real**, algo impossível com o conhecimento estático do LLM.

---

## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 7:
**Crie uma ferramenta personalizada para converter orçamento de USD para EUR e BRL**, com taxas atualizadas (simuladas ou reais).

Vamos fazer uma versão simples com **taxas fixas para teste** (você pode melhorar depois com uma API real).

#### Passo 1: Crie uma pasta `tools/` e um arquivo `currency_converter_tool.py`

Estrutura do projeto:
```
seu_projeto/
├── tools/
│   └── currency_converter_tool.py
├── travel_agents.py
├── travel_tasks.py
└── main.py
```

#### Passo 2: Implemente a ferramenta

```python
# tools/currency_converter_tool.py

from crewai.tools import BaseTool

class CurrencyConverterTool(BaseTool):
    name: str = "Conversor de Moedas"
    description: str = (
        "Converte valores de USD para EUR ou BRL usando taxas de câmbio simuladas. "
        "Use quando o usuário pedir valores em moeda local. "
        "Formato de entrada: '1000 USD to EUR' ou '500 USD to BRL'."
    )

    def _run(self, query: str) -> str:
        # Simula taxas de câmbio (você pode substituir por uma API real depois)
        rates = {
            "EUR": 0.93,
            "BRL": 5.10
        }

        try:
            parts = query.strip().split(" ")
            if len(parts) != 4 or parts[1].upper() != "USD" or parts[2].lower() != "to":
                return "Formato inválido. Use: '<valor> USD to <EUR|BRL>'"

            amount = float(parts[0])
            target_currency = parts[3].upper()

            if target_currency not in rates:
                return f"Moeda {target_currency} não suportada. Use EUR ou BRL."

            converted = amount * rates[target_currency]
            return f"{amount} USD = {converted:.2f} {target_currency}"

        except Exception as e:
            return f"Erro na conversão: {str(e)}"

    async def _arun(self, query: str) -> str:
        raise NotImplementedError("Conversão assíncrona não suportada.")
```

> ✅ Esta ferramenta:
> - Tem um nome claro,
> - Descrição útil para o LLM,
> - Lógica de conversão simples,
> - Tratamento de erros básico.

#### Passo 3: Dê a ferramenta ao **Escritor de Viagens**

Atualize `travel_agents.py`:

```python
# Adicione no topo:
from tools.currency_converter_tool import CurrencyConverterTool

# Crie a ferramenta
currency_tool = CurrencyConverterTool()

# Atualize o agente escritor:
escritor_viagens = Agent(
    role="Escritor de Viagens",
    goal="Transformar planos de viagem em relatórios cativantes e fáceis de seguir",
    backstory="Você é um escritor de viagens premiado, conhecido por guiar leitores com clareza, entusiasmo e dicas práticas.",
    tools=[currency_tool],  # ← agora ele pode converter moedas!
    verbose=True
)
```

#### Passo 4: Atualize a tarefa do escritor

Em `travel_tasks.py`, incentive o uso da ferramenta:

```python
escrever_relatorio = Task(
    description=(
        "Com base no itinerário planejado, escreva um relatório de viagem envolvente e pronto para o viajante usar. "
        "Inclua introdução, dicas gerais, resumo do roteiro e conclusão inspiradora. "
        "Se o orçamento estiver em USD, use a ferramenta de conversão para mostrar também em EUR e BRL."
    ),
    expected_output="Um relatório em linguagem natural, com título, parágrafos bem estruturados, tom acolhedor e valores convertidos para EUR e BRL.",
    agent=escritor_viagens
)
```

#### Passo 5: Execute!
```bash
python main.py
```

Agora, no relatório final, você deve ver algo como:  
> *"O orçamento de 2000 USD equivale a 1860.00 EUR ou 10200.00 BRL."*

---
### 🔹 1. **`name: str = "Conversor de Moedas"` — Por que declarar o tipo (`: str`)?**

#### ✅ Resposta curta:
É uma **dica de tipo** (*type hint*) em Python. Não é obrigatória, mas é **fortemente recomendada** — especialmente em bibliotecas como CrewAI.

#### 📚 Explicação detalhada:
- O CrewAI (e muitas bibliotecas modernas) usa **Pydantic** internamente para validar e gerenciar objetos.
- Pydantic **confia nas type hints** para:
  - Garantir que os campos tenham o tipo correto,
  - Serializar/deserializar dados (ex: para logs ou APIs),
  - Dar mensagens de erro claras se algo estiver errado.
- Se você **não declarar o tipo**, o Pydantic pode não reconhecer a propriedade corretamente, ou assumir um tipo genérico (`Any`), o que pode causar bugs silenciosos.

> 💡 **Boa prática**: Sempre declare os tipos em classes que herdam de `BaseTool`, `Agent`, `Task`, etc.

---

### 🔹 2. **Por que a função `_run` começa com underline?**

#### ✅ Resposta curta:
É uma **convenção do Python** para indicar que é um método **"protegido"** — ou seja, **não deve ser chamado diretamente pelo usuário**, mas sim pela própria biblioteca.

#### 📚 Explicação detalhada:
- No CrewAI, quando um agente decide usar uma ferramenta, ele chama internamente o método `_run`.
- O **nome `_run` é esperado pela classe base `BaseTool`** — é parte do "contrato" da interface.
- O underline (`_`) sinaliza:  
  > “Este método é parte da **implementação interna** da ferramenta. Você, desenvolvedor, só precisa **defini-lo**, mas **não o chame diretamente**.”

> ⚠️ Se você renomear para `run` (sem underline), **a ferramenta NÃO FUNCIONARÁ**, porque o CrewAI procura especificamente por `_run`.

---

### 🔹 3. **O bloco `try/except` — por que usar?**

#### ✅ Resposta curta:
Para **evitar que a execução da Crew quebre** se algo der errado na ferramenta.

#### 📚 Explicação detalhada:
Imagine que o usuário digite algo como `"converter 100 dólares"` — um formato que seu código não espera.

Sem `try/except`:
- Ocorre um `ValueError` ou `IndexError`,
- A exceção **sobe até o CrewAI**,
- A **execução inteira para**, e você vê um traceback feio.

Com `try/except`:
- Você **captura o erro**,
- Retorna uma **mensagem amigável** (ex: `"Formato inválido..."`),
- O agente **continua funcionando** e pode até tentar de novo ou ajustar a abordagem.

> ✅ Isso é **essencial em sistemas autônomos**: ferramentas devem falhar com elegância, não quebrar tudo.

---

### 🔹 4. **Função `async` / `raise` / `NotImplementedError` — o que é isso?**

#### ✅ Resposta curta:
É um **"stub" obrigatório** para compatibilidade com execução assíncrona — mas você pode ignorá-lo por enquanto.

#### 📚 Explicação detalhada:
- O CrewAI suporta **execução assíncrona** (com `await`), útil para melhor desempenho com muitas ferramentas.
- A classe `BaseTool` exige que você implemente **dois métodos**:
  - `_run(self, ...)` → para execução **síncrona** (a que usamos),
  - `_arun(self, ...)` → para execução **assíncrona**.
- Se você **não pretende usar async**, basta **lançar um erro** dizendo que não é suportado:
  ```python
  async def _arun(self, query: str) -> str:
      raise NotImplementedError("Conversão assíncrona não suportada.")
  ```
- Isso evita que alguém tente usar sua ferramenta em modo async sem querer.

> 💡 Para 99% dos projetos iniciais, você só precisa do `_run`. O `_arun` é só um "placeholder".

---

### 🔹 5. **Passo a passo: o que o código espera como entrada e como processa?**

Vamos simular uma chamada real:

#### 📥 **Entrada esperada** (do agente):
```python
"2000 USD to EUR"
```

#### 🔍 **Passo a passo da execução**:

1. **Recebe a string** `query = "2000 USD to EUR"`
2. **Remove espaços extras**: `.strip()` → `"2000 USD to EUR"`
3. **Divide por espaços**: `.split(" ")` → `["2000", "USD", "to", "EUR"]`
4. **Valida o formato**:
   - Tem 4 partes? ✅
   - Segunda parte é `"USD"`? ✅
   - Terceira parte é `"to"`? ✅
5. **Extrai valor**: `amount = float("2000")` → `2000.0`
6. **Extrai moeda alvo**: `target_currency = "EUR"`
7. **Verifica se moeda é suportada**: `"EUR" in rates` → ✅
8. **Calcula conversão**: `2000.0 * 0.93` → `1860.0`
9. **Retorna string formatada**: `"2000 USD = 1860.00 EUR"`

#### ❌ **Se a entrada for inválida**, ex: `"quanto é 1000 em euro?"`:
- O `.split()` gera uma lista com mais ou menos de 4 partes,
- O `if` detecta formato inválido,
- Retorna: `"Formato inválido. Use: '<valor> USD to <EUR|BRL>'"`

> ✅ Isso **orienta o agente** a usar o formato correto nas próximas tentativas!

---

### ✅ Resumo Visual do Fluxo

```
Agente decide usar a ferramenta
        ↓
Chama: currency_tool._run("2000 USD to BRL")
        ↓
Valida formato → OK
        ↓
Busca taxa: BRL = 5.10
        ↓
Calcula: 2000 * 5.10 = 10200.00
        ↓
Retorna: "2000 USD = 10200.00 BRL"
        ↓
Agente inclui isso no relatório final
```
