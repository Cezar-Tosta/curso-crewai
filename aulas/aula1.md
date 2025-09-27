
# 🧠 **Introdução ao CrewAI e Configuração do Ambiente**

---
## 📚 **Teoria**

### O que é CrewAI?
**CrewAI** é uma biblioteca Python de código aberto que permite criar **equipes de agentes de IA autônomos** que colaboram para resolver tarefas complexas. Inspirada na arquitetura de equipes humanas, ela permite definir:

- **Agentes** (com papéis, objetivos e ferramentas),
- **Tarefas** (com descrições, expectativas e responsáveis),
- **Processos** (como os agentes interagem: sequencial, hierárquico, etc.).

O objetivo é **automatizar fluxos de trabalho inteligentes** com múltiplos agentes especializados, como um "time de IA".

### Por que usar CrewAI?
- **Modularidade**: cada agente tem um papel bem definido.
- **Colaboração**: agentes se comunicam e delegam tarefas.
- **Extensibilidade**: integra com LLMs (como OpenAI, Anthropic, Ollama) e ferramentas externas.
- **Simplicidade**: sintaxe clara e intuitiva em Python.

---
## 💻 **Exercícios**

1. **O que diferencia CrewAI de outras bibliotecas de agentes (como LangChain ou AutoGen)?**  
2. Liste os **três componentes principais** de uma equipe em CrewAI.  
3. Qual é o papel do **"process"** em uma equipe do CrewAI?

> ✅ **Gabarito dos Exercícios**
>
>1. **Diferencial do CrewAI**: Foco em **equipes colaborativas de agentes com papéis bem definidos**, enquanto LangChain é mais genérico (cadeias de prompts) e AutoGen exige mais configuração manual de interações.
>2. **Três componentes**: Agentes (Agents), Tarefas (Tasks) e Processos (Processes).
>3. **Papel do "process"**: Define **como os agentes interagem** — por exemplo, se as tarefas são executadas em sequência (`sequential`) ou com delegação dinâmica (`hierarchical`).

---
## 📌 **Resumo**

- CrewAI permite criar **equipes de agentes de IA** que colaboram.
- Três elementos-chave: **Agentes**, **Tarefas** e **Processos**.
- É uma abordagem orientada a **papéis e responsabilidades**, como em times humanos.
- Funciona com qualquer LLM compatível com LangChain.

---
## 🌍 **Exemplo Real**

Imagine uma **startup de marketing digital** que precisa:
- Pesquisar tendências de mercado,
- Criar conteúdo para redes sociais,
- Analisar métricas de engajamento.

Com CrewAI, você pode criar:
- Um **Agente Pesquisador** (coleta dados),
- Um **Agente Criativo** (escreve posts),
- Um **Agente Analista** (avalia desempenho).

Eles trabalham em sequência ou em paralelo, formando um **fluxo automatizado de produção de conteúdo**.

---
## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

Ao longo do curso, vamos construir um **sistema de planejamento de viagens** usando CrewAI. Ele será composto por:

- **Agente Pesquisador**: encontra destinos, preços de voos e hotéis.
- **Agente Planejador**: monta um itinerário diário.
- **Agente Escritor**: gera um relatório de viagem em linguagem natural.

Na **Aula 1**, sua tarefa é apenas **configurar o ambiente** para esse projeto.

### ✅ Passos do Projeto (Aula 1):
1. Instale o Python (versão ≥ 3.9).
2. Crie um ambiente virtual:
   ```bash
   python -m venv crewai-env
   source crewai-env/bin/activate  # Linux/Mac
   # ou
   crewai-env\Scripts\activate     # Windows
   ```
3. Instale o CrewAI:
   ```bash
   pip install crewai
   ```
4. (Opcional, mas recomendado) Instale também o `python-dotenv` para gerenciar chaves de API:
   ```bash
   pip install python-dotenv
   ```

> **Dica**: Se quiser usar a OpenAI, crie uma conta e obtenha uma chave API. Salve-a em um arquivo `.env`:
> ```
> OPENAI_API_KEY=sua_chave_aqui
> ```

