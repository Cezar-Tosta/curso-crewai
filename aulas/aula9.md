
# 🧠 **Testes, Avaliação e Boas Práticas para Projetos Reais com CrewAI**

---

## 📚 **Teoria**

### Por que testar uma Crew?
Agentes de IA são **não determinísticos**: mesmo com os mesmos inputs, podem gerar respostas ligeiramente diferentes.  
Sem testes, você não sabe se:
- A saída está **completa**,
- O formato está **correto**,
- As informações estão **precisas**,
- O fluxo está **funcionando como esperado**.

### Tipos de validação em projetos com CrewAI:

1. **Validação manual (durante o desenvolvimento)**  
   → Execute com `verbose=True` e leia os passos.

2. **Validação por estrutura**  
   → Verifique se a saída contém elementos esperados (ex: "3 destinos", "7 dias").

3. **Validação por conteúdo (mais avançada)**  
   → Use outro agente ou LLM para **avaliar a qualidade** do resultado.

4. **Testes de regressão**  
   → Salve saídas boas como "golden outputs" e compare em atualizações futuras.

> 💡 **Dica profissional**: Nunca confie cegamente na saída de uma Crew — sempre valide.

---

## 💻 **Exercícios**

1. Por que é arriscado usar `verbose=False` em produção sem testes?  
2. O que é uma "golden output"?  
3. Como você pode verificar se o relatório de viagem contém um itinerário de 7 dias?

> **Gabarito**  
> 1. Porque você **não vê o raciocínio do agente** e pode perder erros silenciosos (ex: dados inventados).  
> 2. É uma **saída de referência** considerada correta, usada para comparar futuras execuções.  
> 3. Verificando se o texto contém **7 seções numeradas** (ex: "Dia 1", "Dia 2", ..., "Dia 7") ou usando um agente avaliador.

---

## 📌 **Resumo**

- Testes são **obrigatórios** em projetos reais com CrewAI.
- Use `verbose=True` durante o desenvolvimento.
- Valide **estrutura** e **conteúdo** dos resultados.
- Crie **critérios claros de sucesso** para cada tarefa.
- Considere usar um **agente avaliador** para feedback automático.

---

## 🌍 **Exemplo Real**

Uma empresa de saúde usa uma Crew para gerar resumos de prontuários:
- **Agente 1**: extrai dados do prontuário.
- **Agente 2**: resume em linguagem simples.
- **Agente 3 (avaliador)**: verifica se o resumo contém: diagnóstico, medicação e próxima consulta.

Se faltar algo, o sistema **rejeita a saída** e alerta um humano.

---

## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 9:
**Adicione validação manual e estrutural ao seu projeto.**

#### Passo 1: Execute com `verbose=True` e analise

Rode seu `main.py` e responda:
- O Pesquisador **usou a ferramenta de busca**?
- O Planejador **mencionou o destino escolhido**?
- O Escritor **gerou um texto com introdução, roteiro e conclusão**?

> ✍️ Anote pontos de melhoria (ex: "faltou dizer os melhores meses para visitar").

#### Passo 2: Crie critérios de qualidade

Defina o que um **resultado ideal** deve conter:

| Componente | Critério de Qualidade |
|----------|------------------------|
| **Pesquisa** | 3 destinos, custo total, meses ideais, 3 atrações |
| **Itinerário** | 7 dias, horários, atividades, locais específicos |
| **Relatório** | Título, introdução, roteiro detalhado, conclusão |
#### Passo 3: (Opcional) Adicione um Agente Avaliador

Crie um quarto agente só para **revisar o relatório final**:

```python
# Em travel_agents.py
avaliador_viagem = Agent(
    role="Avaliador de Qualidade de Viagens",
    goal="Verificar se o relatório de viagem atende aos critérios de qualidade",
    backstory="Você é um editor-chefe com olho clínico para detalhes essenciais.",
    verbose=True
)

# Em travel_tasks.py
from travel_agents import avaliador_viagem

avaliar_relatorio = Task(
    description=(
        "Verifique se o relatório final contém: "
        "(1) 3 destinos com custos, "
        "(2) itinerário de 7 dias detalhado, "
        "(3) conversão de moeda, "
        "(4) tom envolvente. "
        "Se faltar algo, liste o que está ausente."
    ),
    expected_output="Lista do que está OK e do que está faltando.",
    agent=avaliador_viagem
)
```

E adicione à sua Crew:
```python
from travel_agents import avaliador_viagem
from travel_tasks import avaliar_relatorio

agents = [pesquisador_viagem, planejador_roteiros, escritor_viagens, avaliador_viagem],
tasks = [pesquisar_destinos, planejar_itinerario, escrever_relatorio, avaliar_relatorio],
```

> ✅ Isso simula um **processo de QA (Quality Assurance) real**.

---

### 💡 Boas práticas finais para projetos com CrewAI

1. **Comece simples**: 1 agente, 1 tarefa. Depois expanda.
2. **Seja específico nas descrições**: evite ambiguidade.
3. **Use `expected_output` como contrato**: orienta o LLM e facilita validação.
4. **Monitore custos**: cada tarefa = chamadas ao LLM.
5. **Nunca exponha chaves de API no código**: sempre use `.env`.
6. **Documente seu fluxo**: quem faz o quê?
