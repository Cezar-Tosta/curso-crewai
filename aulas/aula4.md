# 🧠 **Criando e Executando uma Crew**

---
## 📚 **Teoria**

### O que é uma **Crew** no CrewAI?
Uma **Crew** é o "orquestrador" da sua equipe de IA. Ela:
- Reúne **agentes** e **tarefas**,
- Define **como os agentes colaboram** (`process`),
- **Executa** o fluxo de trabalho e retorna o resultado final.

### Tipos de `process` (fluxo de trabalho):
1. **`sequential`** *(padrão)*:  
   As tarefas são executadas **na ordem em que foram adicionadas**, cada uma por seu agente. Ideal para fluxos lineares (ex: pesquisar → planejar → escrever).

2. **`hierarchical`**:  
   Um **gerente** (manager agent) delega tarefas e coordena os outros agentes. Útil para problemas complexos com tomada de decisão dinâmica.

> Neste curso, usaremos `sequential` até a aula avançada.

### Como criar e executar uma Crew?
```python
from crewai import Crew

crew = Crew(
    agents=[pesquisador_viagem],
    tasks=[pesquisar_destinos],
    process="sequential",
    verbose=True
)

resultado = crew.kickoff()
print(resultado)
```

> 🚀 O método `kickoff()` **executa todas as tarefas** e retorna o resultado da **última tarefa**.

---
## 💻 **Exercícios**

1. Qual método é usado para **executar** uma Crew?  
2. Qual é o `process` padrão se você não especificar?  
3. O que acontece se você passar uma lista vazia de `agents` ou `tasks`?

> **Gabarito**  
> 1. `kickoff()`  
> 2. `sequential`  
> 3. O CrewAI lançará um erro (`ValueError`) — você precisa de pelo menos um agente e uma tarefa.

---
## 📌 **Resumo**

- A **Crew** é o núcleo executável da sua equipe de IA.
- Use `process="sequential"` para fluxos simples e previsíveis.
- `kickoff()` inicia o trabalho e retorna o resultado final.
- Sempre inclua pelo menos **um agente e uma tarefa**.
- `verbose=True` na Crew mostra **todo o fluxo de execução** no terminal.

---
## 🌍 **Exemplo Real**

Uma agência de notícias usa uma Crew para gerar artigos diários:
1. **Agente Pesquisador**: coleta fatos sobre um evento.
2. **Agente Escritor**: redige a matéria.
3. **Agente Editor**: revisa o texto.

Tudo é executado com:
```python
noticias_crew = Crew(agents=[pesq, escr, edit], tasks=[t1, t2, t3], process="sequential")
artigo = noticias_crew.kickoff()
```
Resultado: um artigo pronto em minutos, sem intervenção humana.

---
## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 4:
**Execute sua primeira Crew!**

1. Crie um arquivo chamado `main.py`.
2. Importe:
   - O agente `pesquisador_viagem` de `travel_agents.py`
   - A tarefa `pesquisar_destinos` de `travel_tasks.py`
3. Crie uma Crew com:
   - `agents=[pesquisador_viagem]`
   - `tasks=[pesquisar_destinos]`
   - `process="sequential"`
   - `verbose=True`
4. Execute com `kickoff()` e imprima o resultado.

### 📄 Exemplo de código (`main.py`):
```python
from crewai import Crew
from travel_agents import pesquisador_viagem
from travel_tasks import pesquisar_destinos

if __name__ == "__main__":
    trip_crew = Crew(
        agents = [pesquisador_viagem],
        tasks = [pesquisar_destinos],
        process = 'sequential',
        verbose = True
    )

    result = trip_crew.kickoff()
    print("\n")
    print("=" * 30)
    print("===== Resultado Final =====")
    print("=" * 30)
    print(result)
```

### ▶️ Execute:
```bash
python main.py
```

> ⏳ **Atenção**: Isso vai chamar a API da OpenAI! Verifique se seu `.env` está carregado e se há crédito na conta.

Você verá:
- O agente "pensando" (graças ao `verbose=True`),
- A resposta final com os 3 destinos, custos, meses ideais e atrações.

---
### 🔹 **1. O que significa `if __name__ == "__main__":`?**

Essa linha é uma **convenção muito comum em Python** para garantir que um bloco de código só seja executado **quando o arquivo é rodado diretamente**, e **não quando é importado** como módulo.
#### Exemplo:
Se você tem `main.py` e dentro dele:

```python
def iniciar_viagem():
    print("Planejando viagem...")

if __name__ == "__main__":
    iniciar_viagem()
```

- ✅ **Caso 1**: Você executa no terminal:  
  ```bash
  python main.py
  ```  
  → `__name__` é igual a `"__main__"` → o código dentro do `if` **é executado** → imprime "Planejando viagem...".

- ❌ **Caso 2**: Outro arquivo importa `main.py`:  
  ```python
  # outro_arquivo.py
  from main import iniciar_viagem
  ```
  → Nesse caso, `__name__` dentro de `main.py` será `"main"` (não `"__main__"`) → o código dentro do `if` **não é executado**.  
  → Isso evita que a viagem seja planejada **automaticamente** só por importar o módulo!

#### Por que usar isso no `main.py`?
- Boa prática para scripts executáveis.
- Evita efeitos colaterais ao importar.
- Torna o código mais limpo e reutilizável.

> ✅ **Resumo**: é uma "porta de entrada segura" para executar código só quando você quer.

---
### 🔹 **2. O que acontece se eu colocar `tasks` antes de `agents` na Crew?**

**Nada de errado acontece!** 🎉

A ordem dos **parâmetros nomeados** (`agents=...`, `tasks=...`) **não importa** em Python, desde que você use os **nomes dos parâmetros** (keyword arguments).

Ou seja, estas duas formas são **totalmente equivalentes**:

```python
# Forma 1 (como vimos)
Crew(
    agents=[pesquisador_viagem],
    tasks=[pesquisar_destinos],
    process="sequential"
)
```

```python
# Forma 2 (tasks antes de agents)
Crew(
    tasks=[pesquisar_destinos],
    agents=[pesquisador_viagem],
    process="sequential"
)
```

✅ Ambas funcionam perfeitamente.

> ⚠️ **Mas atenção**: se você **não usar os nomes** (ou seja, passar por posição), aí a ordem **importa** — mas **não é recomendado** fazer isso com a classe `Crew`, porque ela espera parâmetros nomeados.

Exemplo **errado/perigoso**:
```python
# NÃO FAÇA ISSO!
Crew([pesquisador_viagem], [pesquisar_destinos])  # ❌ Ordem posicional — frágil e confuso
```

O código oficial do CrewAI **espera argumentos nomeados**, então **sempre use `agents=...` e `tasks=...`** — e aí a ordem não importa.

---
### ✅ Conclusão

- `if __name__ == "__main__":` → executa só quando o arquivo é o **script principal**.
- Ordem de `agents` e `tasks` na `Crew` → **irrelevante**, desde que use os nomes dos parâmetros.

Se quiser, pode até reescrever seu `main.py` assim (totalmente válido):

```python
from crewai import Crew
from travel_agents import pesquisador_viagem
from travel_tasks import pesquisar_destinos

trip_crew = Crew(
    tasks=[pesquisar_destinos],
    agents=[pesquisador_viagem],
    process="sequential",
    verbose=True
)

if __name__ == "__main__":
    result = trip_crew.kickoff()
    print("\n\n######################")
    print("## Resultado Final ##")
    print("######################\n")
    print(result)
```

Funcionará **exatamente da mesma forma**.
