# 🧠 **Adicionando Ferramentas aos Agentes**

---
## 📚 **Teoria**

### O que são **ferramentas** (*Tools*) no CrewAI?
Ferramentas são **funções ou integrações externas** que um agente pode usar para **agir no mundo real**, como:
- Buscar na internet,
- Ler arquivos,
- Acessar APIs,
- Fazer cálculos complexos.

Sem ferramentas, os agentes **só usam o conhecimento do LLM** (até a data de corte do modelo). Com ferramentas, eles **acessam informações atualizadas e executam ações reais**.

### Como adicionar uma ferramenta?
1. **Escolha** (CrewAI tem ferramentas prontas!) **ou crie uma ferramenta**.
2. **Atribua-a ao agente** via parâmetro `tools`.

Exemplo com busca na web (usando Serper.dev):

```python
from crewai import Agent
from crewai_tools import SerperDevTool

search_tool = SerperDevTool()

pesquisador = Agent(
    role="Pesquisador",
    goal="Encontrar informações atualizadas",
    backstory="Você usa a internet para buscar dados recentes.",
    tools=[search_tool],  # ← aqui!
    verbose=True
)
```

> ⚠️ **Importante**:  
> - `SerperDevTool` requer uma chave da API do [Serper.dev](https://serper.dev) (gratuito para testes).  
> - Alternativas: `ScrapeWebsiteTool`, `FileReadTool`, ou suas próprias ferramentas personalizadas.

---

## 💻 **Exercícios**

1. Por que um agente **sem ferramentas** não consegue saber o preço atual de um voo?  
2. Qual parâmetro do `Agent` recebe a lista de ferramentas?  
3. É possível dar **mais de uma ferramenta** a um agente?

> **Gabarito**  
> 1. Porque o LLM só tem conhecimento até sua data de corte (ex: GPT-4 até abril de 2024) e **não acessa a internet por padrão**.  
> 2. O parâmetro é `tools`.  
> 3. Sim! Basta passar uma lista: `tools=[tool1, tool2]`.

---

## 📌 **Resumo**

- Ferramentas permitem que agentes **interajam com o mundo externo**.
- O CrewAI oferece ferramentas prontas (`crewai_tools`) ou você pode criar as suas.
- Atribua ferramentas ao agente com `tools=[...]`.
- Ferramentas **só são usadas se o agente decidir** (com base na tarefa e no LLM).

---

## 🌍 **Exemplo Real**

Um agente de **monitoramento de notícias** usa:
- `SerperDevTool` para buscar notícias recentes sobre uma empresa,
- `ScrapeWebsiteTool` para extrair o conteúdo de artigos,
- Depois resume tudo em um relatório diário.

Sem ferramentas, ele só poderia falar do que "sabia" até 2023 — inútil para notícias!

---

## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 6:
**Dê ao seu Pesquisador de Viagens a capacidade de buscar preços e destinos atualizados na internet.**

#### Passo 1: Instale `crewai-tools`
```bash
pip install crewai-tools
```

#### Passo 2: Obtenha uma chave da API do Serper.dev
- Acesse [https://serper.dev](https://serper.dev)
- Crie uma conta gratuita
- Copie sua **API Key**

#### Passo 3: Adicione ao seu `.env`
```env
OPENAI_API_KEY=sua_chave_openai
SERPER_API_KEY=sua_chave_serper
```

#### Passo 4: Atualize `travel_agents.py`
Importe a ferramenta e atribua ao pesquisador:

```python
# travel_agents.py (atualizado)

from crewai import Agent
from dotenv import load_dotenv
from crewai_tools import SerperDevTool  # ← nova importação

load_dotenv()

# Cria a ferramenta de busca
search_tool = SerperDevTool()

pesquisador_viagem = Agent(
    role="Pesquisador de Viagens",
    goal="Pesquisar e recomendar destinos com base em orçamento, duração e interesses do usuário",
    backstory="Você é um especialista global em turismo com acesso a dados em tempo real sobre voos, hotéis e atrações.",
    tools=[search_tool],  # ← agora com superpoderes!
    verbose=True
)

# Os outros agentes continuam SEM ferramentas (por enquanto)
planejador_roteiros = Agent(
    role="Planejador de Roteiros",
    goal="Criar itinerários diários detalhados e realistas para viagens",
    backstory="Você é um planejador de viagens profissional com expertise em logística, horários e experiências locais autênticas.",
    verbose=True
)

escritor_viagens = Agent(
    role="Escritor de Viagens",
    goal="Transformar planos de viagem em relatórios cativantes e fáceis de seguir",
    backstory="Você é um escritor de viagens premiado, conhecido por guiar leitores com clareza, entusiasmo e dicas práticas.",
    verbose=True
)
```

> 💡 **Dica**: Só o **pesquisador** precisa da ferramenta. Os outros usam o resultado dele.

#### Passo 5: (Opcional) Atualize a descrição da tarefa
Em `travel_tasks.py`, deixe claro que o agente deve **buscar dados atuais**:

```python
pesquisar_destinos = Task(
    description="Use a internet para pesquisar os 3 destinos internacionais MAIS RECOMENDADOS em 2025 para uma viagem de 7 dias com orçamento de até US$2000, incluindo voos e hospedagem.",
    expected_output="Uma lista com: nome do destino, custo total estimado (voos + hotel), melhores meses para visitar e 3 atrações imperdíveis.",
    agent=pesquisador_viagem
)
```

#### Passo 6: Execute!
```bash
python main.py
```

Agora, seu agente **realmente buscará na web** e trará informações **atuais** — não só o que o LLM "lembra"!
Quando você testar, vai ver que o agente está usando a ferramenta (você verá logs como `Searching for...` no terminal).