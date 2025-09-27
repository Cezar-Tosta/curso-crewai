# 🧠 **Próximos Passos: Deploy, Integração e Evolução com CrewAI**

---

## 📚 **Teoria**

### De projeto local a produto real: o que muda?
Seu código atual roda no terminal. Para virar um **produto útil**, ele precisa:
- Ser **acessado por usuários** (web, API, chat),
- **Proteger chaves de API**,
- **Lidar com erros** de forma elegante,
- **Escalar** conforme a demanda.

### Opções de integração comuns:

1. **API REST (FastAPI / Flask)**  
   → Ideal para integrar com apps, sites ou outros serviços.

2. **Interface de chat (Streamlit, Gradio, Telegram, WhatsApp)**  
   → Perfeito para assistentes interativos.

3. **Automação agendada (cron, Airflow)**  
   → Útil para relatórios diários, monitoramento, etc.

4. **Plugin para ferramentas existentes (Notion, Slack, Zapier)**  
   → Aumenta o valor dentro de fluxos já usados.

> 💡 **Regra de ouro**: Comece com uma **interface simples** (ex: API ou Streamlit) antes de escalar.

---

## 💻 **Exercícios**

1. Por que não se deve colocar `OPENAI_API_KEY` diretamente no código-fonte?  
2. Qual framework Python é mais leve e rápido para criar uma API com CrewAI?  
3. O que você faria se um usuário quisesse planejar uma viagem com parâmetros personalizados (ex: destino, orçamento, duração)?

> **Gabarito**  
> 1. Porque **vaza credenciais** se o código for compartilhado (ex: GitHub). Use `.env` + `.gitignore`.  
> 2. **FastAPI** (moderno, rápido, com suporte a async e documentação automática).  
> 3. Criaria uma **função que gera tarefas dinamicamente** com base nos inputs do usuário.

---

## 📌 **Resumo**

- **Nunca hardcode chaves de API** — sempre use variáveis de ambiente.
- **Interfaces simples** (API, chat) tornam seu agente acessível.
- **Parâmetros dinâmicos** tornam sua Crew reutilizável.
- **Monitore custos e uso** em produção.
- **Comece pequeno, valide, depois escale**.

---

## 🌍 **Exemplo Real**

Uma startup lançou um bot no WhatsApp chamado **"ViagemBot"**:
- O usuário envia: *"Quero ir para o Japão, 10 dias, orçamento US$3000"*
- O backend (em FastAPI) recebe a mensagem,
- Gera uma Crew **personalizada** com esses parâmetros,
- Retorna o relatório em formato de texto ou PDF.

Resultado: **milhares de usuários**, sem intervenção humana.

---

## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 10:
**Transforme seu projeto em uma API simples com FastAPI**.

#### Passo 1: Instale o FastAPI e Uvicorn

```bash
pip install fastapi uvicorn
```

#### Passo 2: Atualize `travel_tasks.py` para gerar tarefas sob demanda

```python
# travel_tasks.py

from crewai import Task
from travel_agents import pesquisador_viagem, planejador_roteiros, escritor_viagens, avaliador_viagem

# =============== TAREFAS ESTÁTICAS (para testes locais) ===============
pesquisar_destinos = Task(
    description=(
        "Pesquise 3 destinos internacionais acessíveis para uma viagem de 7 dias "
        "com orçamento de até US$2000, incluindo voos e hospedagem. "
        "Use a ferramenta de busca na internet para obter dados atualizados."
    ),
    expected_output=(
        "Lista com: nome do destino, custo total estimado (voos + hotel), "
        "melhores meses para visitar e 3 atrações imperdíveis."
    ),
    agent=pesquisador_viagem
)

planejar_itinerario = Task(
    description=(
        "Com base na lista de destinos e custos gerada pelo Pesquisador de Viagens, "
        "selecione o destino mais recomendado e crie um itinerário detalhado de 7 dias. "
        "Inclua atividades diárias, horários sugeridos e tempo de deslocamento."
    ),
    expected_output=(
        "Itinerário numerado por dia, com horários, atividades, locais e dicas práticas."
    ),
    agent=planejador_roteiros
)

escrever_relatorio = Task(
    description=(
        "Com base no itinerário criado pelo Planejador de Roteiros, "
        "escreva um relatório de viagem envolvente e pronto para uso. "
        "Inclua introdução, dicas gerais, resumo do roteiro e conclusão inspiradora."
    ),
    expected_output=(
        "Relatório em linguagem natural, com título, parágrafos bem estruturados "
        "e tom acolhedor."
    ),
    agent=escritor_viagens
)

avaliar_relatorio = Task(
    description=(
        "Verifique se o relatório final contém: "
        "(1) O destino com custos, "
        "(2) Itinerário de 7 dias detalhado, "
        "(3) Tom envolvente. "
        "Se faltar algo, liste o que está ausente."
    ),
    expected_output="Lista do que está OK e do que está faltando.",
    agent=avaliador_viagem
)

print("""\nTarefas criadas com sucesso:
    - Pesquisar Destinos;
    - Planejar Itinerário;
    - Escrever Relatório; e
    - Avaliar Relatório.""")

# =============== FUNÇÃO PARA TAREFAS DINÂMICAS (para API) ===============
def criar_tarefas_viagem(dias: int = 7, orcamento: int = 2000, regiao: str = "internacional"):
    """Gera tarefas personalizadas para uso em APIs ou interfaces interativas."""
    t1 = Task(
        description=(
            f"Pesquise 3 destinos {regiao} acessíveis para uma viagem de {dias} dias "
            f"com orçamento de até US${orcamento}, incluindo voos e hospedagem."
        ),
        expected_output=(
            "Lista com: nome do destino, custo total estimado, melhores meses e 3 atrações."
        ),
        agent=pesquisador_viagem
    )

    t2 = Task(
        description=(
            f"Com base nos destinos sugeridos, crie um itinerário detalhado de {dias} dias "
            "para o destino mais recomendado."
        ),
        expected_output="Itinerário numerado por dia com horários e atividades.",
        agent=planejador_roteiros
    )

    t3 = Task(
        description="Escreva um relatório de viagem envolvente com base no itinerário.",
        expected_output="Relatório em linguagem natural com título e conclusão.",
        agent=escritor_viagens
    )

    t4 = Task(
        description=(
            "Verifique se o relatório contém: destino com custos, itinerário de "
            f"{dias} dias e tom envolvente. Liste o que está faltando."
        ),
        expected_output="Lista do que está OK e do que está ausente.",
        agent=avaliador_viagem
    )

    return [t1, t2, t3, t4]
```

> ✅ **Por que isso funciona?**  
> Cada chamada cria **novas instâncias de `Task`** com descrições atualizadas — exatamente o que precisamos.

#### Passo 3: Arquivo `travel_agents.py` refinado
```python
# travel_agents.py

from crewai import Agent
from dotenv import load_dotenv
from crewai_tools import SerperDevTool
from tools.currency_converter_tool import CurrencyConverterTool

load_dotenv()  # Carrega as variáveis do .env

# Ferramentas
search_tool = SerperDevTool()
currency_tool = CurrencyConverterTool()

# Agentes
pesquisador_viagem = Agent(
    role="Pesquisador de Viagens",
    goal="Pesquisar e recomendar destinos com base em orçamento, duração e interesses do usuário",
    backstory="Você é um especialista global em turismo com acesso a dados em tempo real sobre voos, hotéis e atrações.",
    tools=[search_tool],
    verbose=True
)

planejador_roteiros = Agent(
    role="Planejador de Roteiros",
    goal="Criar itinerários diários detalhados e realistas para viagens",
    backstory="Você é um planejador de viagens profissional com expertise em logística, horários e experiências locais autênticas.",
    verbose=True
)

escritor_viagens = Agent(
    role="Escritor de Viagens",
    goal="Transformar planos de viagens em relatórios cativantes e fáceis de seguir",
    backstory="Você é um escritor de viagens premiado, conhecido por guiar leitores com clareza, entusiasmo e dicas práticas.",
    tools=[currency_tool],
    verbose=True
)

avaliador_viagem = Agent(
    role="Avaliador de Qualidade de Viagens",
    goal="Verificar se o relatório de viagem atende aos critérios de qualidade",
    backstory="Você é um editor-chefe com olho clínico para detalhes essenciais.",
    verbose=True
)

# Só imprime os agentes se este arquivo for executado diretamente
if __name__ == "__main__":
    print(f"""Agentes criados com sucesso:
    - {pesquisador_viagem.role};
    - {planejador_roteiros.role}; 
    - {escritor_viagens.role}; e
    - {avaliador_viagem.role}.""")
```
#### Passo 4: Crie `api.py` usando essa função

```python
# api.py

from fastapi import FastAPI
from pydantic import BaseModel
from crewai import Crew
from travel_tasks import criar_tarefas_viagem

app = FastAPI(
    title="Assistente de Viagem com CrewAI",
    description="API para planejar viagens personalizadas usando agentes autônomos.",
    version="1.0.0"
)

class TravelRequest(BaseModel):
    dias: int = 7
    orcamento_usd: int = 2000
    regiao_interesse: str = "internacional"

@app.post("/planejar_viagem", summary="Planeja uma viagem personalizada")
def planejar_viagem(request: TravelRequest):
    """
    Recebe parâmetros da viagem e retorna um relatório completo gerado por agentes.
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

        resultado = trip_crew.kickoff()
        return {
            "status": "sucesso",
            "relatorio_viagem": str(resultado)
        }

    except Exception as e:
        return {
            "status": "erro",
            "mensagem": str(e)
        }
```

> 💡 **Nota**: `agents=[task.agent for task in tasks]` garante que a lista de agentes corresponda exatamente às tarefas.

#### Passo 5
- Suba a API com o comando:
```bash
uvicorn api:app --reload
```
- Acesse a interface interativa: [http://localhost:8000/docs](http://localhost:8000/docs) 
- Teste a rota `/planejar_viagem` com JSON
```json
{
  "dias": 5,
  "orcamento_usd": 1800,
  "regiao_interesse": "Sudeste Asiático"
}
```

#### Avaliação do Resultado da API

Do jeito que está, a API **retorna apenas o resultado da última tarefa** (a avaliação). 
O **relatório final é gerado mas não retornado separadamente**.

Vamos **modificar o código para que a API retorne os resultados de ambas as tarefas**: o **relatório de viagem** (3º agente) e a **avaliação** (4º agente).

##### 🛠️ O que precisamos alterar?
`api.py`  
→ Para acessar os resultados intermediários das tarefas e retornar ambos.
##### ✅ Código atualizado do `api.py`
```python
# api.py

from fastapi import FastAPI
from pydantic import BaseModel
from crewai import Crew
from travel_tasks import criar_tarefas_viagem

app = FastAPI(
    title="Assistente de Viagem com CrewAI",
    description="API para planejar viagens personalizadas usando agentes autônomos.",
    version="1.0.0"
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
##### ✅ Resultado da API

Agora, ao chamar a API, você receberá:

```json
{
  "status": "sucesso",
  "relatorio_viagem": "Relatório completo gerado pelo Escritor...",
  "avaliacao": "Lista do que está OK e do que está ausente."
}
```

Agora sua API **retorna ambos os resultados**, e você pode usá-los no frontend para exibir **relatório e avaliação separadamente**.

---

### 🏁 Conclusão

Você agora sabe:
- Criar agentes, tarefas e equipes com CrewAI,
- Adicionar ferramentas externas e personalizadas,
- Projetar fluxos eficientes sem redundância,
- Validar e testar resultados,
- **Transformar seu projeto em um serviço real**.

O CrewAI é uma ferramenta poderosa — mas o **valor está em como você a aplica**.

Agora vamos começar a parte de **FRONT-END**.

---

