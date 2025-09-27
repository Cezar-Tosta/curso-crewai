# 🧠 **Aula 2: Criando Seu Primeiro Agente com crewAI**

---

## 📚 **Teoria**

### O que é um **Agente** no crewAI?
Um **agente** é uma entidade autônoma com:
- Um **papel** (*role*): sua função na equipe (ex: "Pesquisador de Viagens").
- Um **objetivo** (*goal*): o que ele deve alcançar (ex: "Encontrar os melhores destinos com base no orçamento do usuário").
- Uma **backstory** (*backstory*): contexto que explica sua expertise (ex: "Você é um especialista em turismo com 10 anos de experiência...").

Além disso, um agente pode usar **ferramentas** (como busca na web, cálculos, APIs) e possui um **LLM** (modelo de linguagem) associado — por padrão, o crewAI usa o modelo da OpenAI (GPT-3.5/4) se você tiver a chave configurada.

### Como criar um agente?
Usando a classe `Agent` do crewAI:

```python
from crewai import Agent

pesquisador = Agent(
    role="Pesquisador de Viagens",
    goal="Encontrar destinos turísticos acessíveis e populares",
    backstory="Você é um especialista em viagens com acesso a dados atualizados de preços e tendências.",
    verbose=True  # mostra o raciocínio do agente no terminal
)
```

> **Dica**: `verbose=True` é ótimo para depuração e aprendizado!

---

## 💻 **Exercícios**

1. Qual atributo define **o que o agente deve alcançar**?  
2. O que acontece se você não definir um `backstory`?  
3. Crie, em pseudocódigo, um agente chamado "Planejador de Roteiros" com objetivo de montar itinerários diários.

> **Gabarito**  
> 1. O atributo é `goal`.  
> 2. Nada impede a execução, mas o agente pode ter desempenho inferior, pois a *backstory* ajuda o LLM a contextualizar seu comportamento e tomada de decisão.  
> 3. Exemplo esperado:
>    ```python
>    planejador = Agent(
>        role="Planejador de Roteiros",
>        goal="Criar itinerários diários detalhados para viagens",
>        backstory="Você é um organizador profissional de viagens com experiência em logística e lazer."
>    )
>    ```

---

## 🔗 **Link Útil**

- [Documentação: Agents](https://docs.crewai.com/core-concepts/Agents)

---

## 📌 **Resumo**

- Um **agente** tem `role`, `goal` e `backstory`.
- O `goal` define sua missão; a `backstory` dá contexto.
- Use `verbose=True` para ver o pensamento do agente.
- O LLM é configurado automaticamente se você tiver `OPENAI_API_KEY` no `.env`.

---

## 🌍 **Exemplo Real**

Uma empresa de turismo usa um agente chamado **"Agente de Recomendação Personalizada"** que:
- Recebe o perfil do cliente (orçamento, interesses, duração),
- Usa sua `backstory` para simular um consultor humano,
- Gera sugestões de destinos com justificativas.

Esse agente é o **primeiro contato** do sistema com o usuário — tudo automatizado, mas com tom empático e profissional.

---

## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 2:
Crie o **primeiro agente** do seu projeto: o **Pesquisador de Viagens**.

1. Crie um arquivo chamado `travel_agents.py`.
2. Nele, defina um agente com:
   - `role`: "Pesquisador de Viagens"
   - `goal`: "Pesquisar e recomendar destinos com base em orçamento, duração e interesses do usuário"
   - `backstory`: "Você é um especialista global em turismo com acesso a dados em tempo real sobre voos, hotéis e atrações."
   - `verbose`: `True`

3. (Opcional) Teste o agente com um `print` para garantir que foi criado.

> **Dica**: Não se preocupe em executar tarefas ainda — só criar o agente.

### 📄 Exemplo de código (`travel_agents.py`):
```python
from crewai import Agent
from dotenv import load_dotenv
import os

load_dotenv()  # Carrega as variáveis do .env

pesquisador_viagem = Agent(
    role="Pesquisador de Viagens",
    goal="Pesquisar e recomendar destinos com base em orçamento, duração e interesses do usuário",
    backstory="Você é um especialista global em turismo com acesso a dados em tempo real sobre voos, hotéis e atrações.",
    verbose=True
)

# Teste simples
print("Agente criado com sucesso!")
```

Execute com:
```bash
python travel_agents.py
```

Se não houver erros, está tudo certo!
