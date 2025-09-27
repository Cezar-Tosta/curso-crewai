# 🧠 **Aula 3: Criando Tarefas e Atribuindo a Agentes**

---

## 📚 **Teoria**

### O que é uma **Tarefa** (*Task*) no crewAI?
Uma **tarefa** é uma unidade de trabalho que um agente deve executar. Ela define:
- **O que fazer** (`description`),
- **Qual o resultado esperado** (`expected_output`),
- **Quem é responsável** (`agent`).

As tarefas são o "combustível" da equipe: sem elas, os agentes não têm nada para fazer!

### Como criar uma tarefa?
Usando a classe `Task`:

```python
from crewai import Task

tarefa_pesquisa = Task(
    description="Pesquise os 3 destinos mais populares na Europa para viagens de verão com orçamento de até R$5000.",
    expected_output="Uma lista com os nomes dos destinos, custo médio estimado e principais atrações.",
    agent=pesquisador_viagem  # o agente criado na aula anterior
)
```

> ⚠️ **Importante**:  
> - `description` deve ser clara e contextualizada.  
> - `expected_output` orienta o LLM sobre o **formato e conteúdo** do resultado. Isso melhora muito a qualidade da resposta!

---

## 💻 **Exercícios**

1. Qual atributo da tarefa diz **quem deve executá-la**?  
2. Por que é importante definir `expected_output`?  
3. Escreva o código de uma tarefa chamada `planejar_itinerario` para o agente `planejador` (ainda não criado, mas imagine que existe), com descrição e saída esperada.

> **Gabarito**  
> 1. O atributo é `agent`.  
> 2. Porque ajuda o LLM a entender **como estruturar a resposta** (ex: lista, parágrafo, JSON), evitando respostas vagas ou fora do formato.  
> 3. Exemplo:
>    ```python
>    planejar_itinerario = Task(
>        description="Crie um itinerário diário detalhado para uma viagem de 5 dias a Lisboa, incluindo cafés da manhã, passeios, almoços, jantares e transporte.",
>        expected_output="Um plano por dia em formato de lista numerada, com horários estimados e nomes de locais específicos.",
>        agent=planejador
>    )
>    ```

---

## 📌 **Resumo**

- Toda tarefa precisa de: `description`, `expected_output` e `agent`.
- A `expected_output` **não é opcional** na prática — ela guia a qualidade do resultado.
- Tarefas são atribuídas a **um único agente** (por enquanto; equipes podem delegar depois).
- Tarefas **não são executadas sozinhas** — precisam ser agrupadas em uma **Crew** (próxima aula!).

---

## 🌍 **Exemplo Real**

Uma startup de educação usa crewAI para criar planos de estudo:
- **Tarefa 1**: "Pesquise os tópicos mais cobrados no ENEM em matemática." → atribuída ao *Agente Pesquisador*.
- **Tarefa 2**: "Monte um cronograma de 30 dias com exercícios e revisões." → atribuída ao *Agente Planejador*.

Cada tarefa tem uma `expected_output` clara (ex: "lista com 10 tópicos" ou "tabela com dias e temas"), garantindo resultados úteis.

---

## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 3:
Crie a **primeira tarefa** do seu projeto: **pesquisar destinos**.

1. Crie um arquivo chamado `travel_tasks.py`.
2. Importe o agente `pesquisador_viagem` do arquivo `travel_agents.py`.
3. Defina uma tarefa chamada `pesquisar_destinos` com:
   - `description`: "Pesquise 3 destinos internacionais acessíveis para uma viagem de 7 dias com orçamento de até US$2000, incluindo voos e hospedagem."
   - `expected_output`: "Uma lista com: nome do destino, custo total estimado (voos + hotel + atrações), melhores meses para visitar e 3 atrações imperdíveis."
   - `agent`: `pesquisador_viagem`

4. Adicione um `print("Tarefa criada!")` para testar.

### 📄 Exemplo de código (`travel_tasks.py`):
```python
from crewai import Task
from travel_agents import pesquisador_viagem

pesquisar_destinos = Task(
    description="Pesquise 3 destinos internacionais acessíveis para uma viagem de 7 dias com orçamento de até US$2000, incluindo voos e hospedagem.",
    expected_output="Uma lista com: nome do destino, custo total estimado (voos + hotel + atrações), melhores meses para visitar e 3 atrações imperdíveis.",
    agent=pesquisador_viagem
)

print("Tarefa criada!")
```

Execute com:
```bash
python travel_tasks.py
```

Se rodar sem erro, está tudo certo! (Lembre-se: a tarefa ainda **não será executada** — só definida.)
