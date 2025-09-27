# 🧠 **Equipes com Múltiplos Agentes e Tarefas Sequenciais**

---
## 📚 **Teoria**

### Por que usar **múltiplos agentes**?
Um único agente pode fazer muita coisa, mas **especialização traz qualidade**.  
Assim como em uma empresa:
- O **pesquisador** coleta dados,
- O **planejador** organiza o cronograma,
- O **escritor** comunica de forma clara.

No CrewAI, você replica essa divisão de trabalho com **agentes especializados**.

### Como funciona o processo **`sequential`** com múltiplas tarefas?
- As tarefas são executadas **na ordem da lista**.
- Cada tarefa é atribuída a **um agente específico**.
- O **resultado de uma tarefa pode ser usado como contexto** para a próxima (mesmo que não explicitamente — o LLM "lembra" do histórico da execução).

> 💡 Dica: Para tornar a dependência explícita, você pode incluir na `description` da tarefa seguinte algo como:  
> *"Com base na lista de destinos fornecida anteriormente, crie um itinerário..."*

---

## 💻 **Exercícios**

1. Em um fluxo `sequential` com 3 tarefas, quantos agentes diferentes podem ser usados?  
2. O resultado da **primeira tarefa** é automaticamente passado para a **segunda**?  
3. Qual é a vantagem de ter um agente só para **escrever o relatório final**?

> **Gabarito**  
> 1. De **1 a 3** (você pode reutilizar o mesmo agente ou usar um diferente para cada tarefa).  
> 2. **Não automaticamente como variável**, mas o LLM tem acesso ao **histórico completo da execução**, então "sabe" o que foi feito antes. Para maior clareza, é bom mencionar isso na descrição da tarefa.  
> 3. Porque um agente especializado em **comunicação** pode gerar um texto mais fluido, persuasivo e bem formatado do que um agente técnico focado em dados.

---
## 📌 **Resumo**

- Use **múltiplos agentes** para especialização.
- No modo `sequential`, a **ordem das tarefas define o fluxo**.
- O LLM tem **memória do histórico**, mas **descrever dependências** melhora os resultados.
- Cada tarefa deve ter um **propósito claro** e um **agente adequado**.

---
## 🌍 **Exemplo Real**

Uma empresa de e-commerce usa uma Crew para lançar um novo produto:
1. **Agente de Mercado**: pesquisa concorrentes e tendências.
2. **Agente de Produto**: define preço, nome e descrição.
3. **Agente de Marketing**: cria campanha para redes sociais.

Tudo é executado em sequência, e o resultado final é um **kit de lançamento completo** — tudo em minutos.

---
## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 5:
**Adicione dois novos agentes e duas novas tarefas** ao seu projeto.

#### Passo 1: Atualize `travel_agents.py`
Adicione:
- **Planejador de Roteiros**
- **Escritor de Viagens**

```python
# travel_agents.py (atualizado)

from crewai import Agent
from dotenv import load_dotenv

load_dotenv()

pesquisador_viagem = Agent(
    role="Pesquisador de Viagens",
    goal="Pesquisar e recomendar destinos com base em orçamento, duração e interesses do usuário",
    backstory="Você é um especialista global em turismo com acesso a dados em tempo real sobre voos, hotéis e atrações.",
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
    goal="Transformar planos de viagem em relatórios cativantes e fáceis de seguir",
    backstory="Você é um escritor de viagens premiado, conhecido por guiar leitores com clareza, entusiasmo e dicas práticas.",
    verbose=True
)

# Testar se os agentes foram criados. 
print(f"""Agentes criados com sucesso:
    - {pesquisador_viagem.role};
    - {planejador_roteiros.role}; e
    - {escritor_viagens.role}""")
```

#### Passo 2: Atualize `travel_tasks.py`
Adicione duas novas tarefas:

```python
# travel_tasks.py (atualizado)

from crewai import Task
from travel_agents import pesquisador_viagem, planejador_roteiros, escritor_viagens

pesquisar_destinos = Task(
    description="Pesquise 3 destinos internacionais acessíveis para uma viagem de 7 dias com orçamento de até US$2000, incluindo voos e hospedagem.",
    expected_output="Uma lista com: nome do destino, custo total estimado (voos + hotel), melhores meses para visitar e 3 atrações imperdíveis.",
    agent=pesquisador_viagem
)

planejar_itinerario = Task(
    description="Com base nos destinos sugeridos, crie um itinerário detalhado de 7 dias para o destino mais recomendado. Inclua atividades diárias, horários sugeridos, transporte entre pontos e tempo de deslocamento.",
    expected_output="Um itinerário por dia, numerado, com horários, atividades, locais e dicas práticas.",
    agent=planejador_roteiros
)

escrever_relatorio = Task(
    description="Com base no itinerário planejado, escreva um relatório de viagem envolvente e pronto para o viajante usar. Inclua introdução, dicas gerais, resumo do roteiro e conclusão inspiradora.",
    expected_output="Um relatório em linguagem natural, com título, parágrafos bem estruturados e tom acolhedor.",
    agent=escritor_viagens
)

print("""\nTarefas criadas com sucesso:
    - Pesquisar Destinos;
    - Planejar Itinerário; e
    - Escrever Relatório.""")
```

#### Passo 3: Atualize `main.py`
Agora use os **três agentes** e as **três tarefas**:

```python
# main.py (atualizado)

from crewai import Crew
from travel_agents import pesquisador_viagem, planejador_roteiros, escritor_viagens
from travel_tasks import pesquisar_destinos, planejar_itinerario, escrever_relatorio

if __name__ == "__main__":
    trip_crew = Crew(
        agents=[pesquisador_viagem, planejador_roteiros, escritor_viagens],
        tasks=[pesquisar_destinos, planejar_itinerario, escrever_relatorio],
        process="sequential",
        verbose=True
    )

    result = trip_crew.kickoff()
    print("\n")
    print("=" * 45)
    print("===== Resultado Final de Viagem =====")
    print("=" * 45)
    print(result)
```

### ▶️ Execute:
```bash
python main.py
```

Agora você terá:
1. Pesquisa de destinos →  
2. Planejamento do roteiro →  
3. Relatório final cativante!

> ⏳ Pode levar alguns minutos (3 chamadas à API), mas o resultado será **muito mais rico**.

---
### 🔍 O que acontece quando você faz `from travel_agents import pesquisador_viagem`?

Quando você **importa algo de um módulo** em Python (como `from travel_agents import pesquisador_viagem`), o Python:

1. **Localiza o arquivo** `travel_agents.py`,
2. **Executa todo o código de nível superior** (top-level) desse arquivo **na primeira vez que ele é importado**,
3. **Extrai o objeto** que você pediu (`pesquisador_viagem`) e o coloca no seu namespace atual.

> ⚠️ **Importante**: "Executar todo o código de nível superior" significa que **todas as linhas que não estão dentro de funções, classes ou blocos condicionais** (como `if __name__ == "__main__"`) **são executadas imediatamente**.

---
### 📄 Veja seu `travel_agents.py` atual:

```python
from crewai import Agent
from dotenv import load_dotenv

load_dotenv()  # ← executado na importação

pesquisador_viagem = Agent(...)  # ← executado na importação
planejador_roteiros = Agent(...) # ← executado na importação
escritor_viagens = Agent(...)    # ← executado na importação
```

Essas linhas **não estão dentro de funções** — estão no "top level".  
Então, **toda vez que alguém importar `travel_agents`**, o Python **cria os três agentes na memória**.

Isso é **normal e esperado** — afinal, para você importar `pesquisador_viagem`, ele precisa existir!

---
### ❓ Mas isso é um problema?

**Não necessariamente.** Na verdade, é **o comportamento desejado** na maioria dos casos, porque:

- Você **precisa que os agentes sejam criados** para usá-los nas tarefas.
- A criação do agente **não chama a API ainda** — só configura o objeto em memória.
- A chamada à API (OpenAI) só acontece **quando o agente executa uma tarefa** (dentro de `kickoff()`).

✅ **Ou seja**:  
Importar `travel_agents` **não gera custo com API**, só prepara os objetos.

---
### 💡 Como evitar execução indesejada? (Boa prática)

Se, no futuro, você quiser **testar ou executar algo diretamente em `travel_agents.py`** (ex: criar um agente e imprimir algo), **use `if __name__ == "__main__"`** para isolar:

```python
# travel_agents.py

from crewai import Agent
from dotenv import load_dotenv

load_dotenv()

pesquisador_viagem = Agent(...)
planejador_roteiros = Agent(...)
escritor_viagens = Agent(...)

# Só executa se rodar DIRETAMENTE este arquivo
if __name__ == "__main__":
    print("Agentes criados com sucesso!")
    print(pesquisador_viagem.role)
```

Assim:
- Ao importar: só os agentes são criados (sem prints extras).
- Ao rodar `python travel_agents.py`: você vê os prints de teste.

---
### ✅ Resumo

- **Sim**, os agentes são criados quando você importa `travel_agents` — **porque precisam existir para serem usados**.
- Isso **não é um erro**, é como o Python funciona.
- **Nenhuma chamada à API ocorre nesse momento** — só na execução da `Crew`.
- Use `if __name__ == "__main__"` se quiser rodar **testes isolados** no arquivo de agentes.
