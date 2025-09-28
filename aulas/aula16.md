# 🧠 **Agentes com Acesso a Banco de Dados: Integração com PostgreSQL, MySQL e outros**

---

## 📚 **Teoria**

### Por que integrar com banco de dados?

- **Dados estruturados** (usuários, pedidos, preços, estoque, etc.)
- **Respostas dinâmicas** baseadas em dados reais
- **Sincronização em tempo real** com sistemas empresariais

### Opções de bancos de dados:

- **PostgreSQL**: robusto, com suporte a JSON, vetores, etc.
- **MySQL**: popular, bom desempenho.
- **SQLite**: leve, ideal para testes.
- **SQL Server, Oracle**: para ambientes corporativos.

---

## 💻 **Exercícios**

1. Qual biblioteca Python é comum para conexão com bancos de dados SQL?  
2. Por que você deve usar **índices** ao consultar grandes tabelas?  
3. Qual é a vantagem de usar **SQLAlchemy** em vez de consultas diretas?

> **Gabarito**  
> 1. `SQLAlchemy`, `psycopg2`, `mysql-connector-python`, etc.  
> 2. Para **acelerar a busca** em grandes volumes de dados.  
> 3. **Abstração, segurança, e suporte a múltiplos bancos**.

---

## 📌 **Resumo**

- Agentes podem acessar bancos de dados via **ferramentas personalizadas**.
- Use **SQLAlchemy** para conexão segura e abstração.
- Crie consultas específicas para **evitar sobrecarga**.
- Combine com **índices e cache** para melhor desempenho.

---

## 🌍 **Exemplo Real**

Uma agência de viagens:
- Tem um banco com preços de hotéis, voos, pacotes.
- Agente responde: *"Quais hotéis em Paris estão disponíveis por menos de 100 euros?"*
- Consulta o banco e retorna dados atualizados.

---

## 🛠️ **Projeto Contínuo: "Assistente de Viagem Inteligente"**

### ✅ Tarefa da Aula 16:
**Criar um agente que consulte um banco de dados**

Vamos criar uma **ferramenta personalizada** que:
- Conecta a um banco de dados (ex: PostgreSQL),
- Executa consultas SQL,
- Retorna resultados para o agente.

---

### 🔧 Passo 1: Instale as bibliotecas necessárias

#### Para PostgreSQL:
```bash
pip install sqlalchemy psycopg2-binary
```

#### Para MySQL:
```bash
pip install sqlalchemy mysql-connector-python
```

#### Para SQLite (já vem com Python):
```bash
# Nada necessário
```

---

### 🔧 Passo 2: Crie uma ferramenta para consultar banco de dados

Crie um novo arquivo: `tools/database_reader_tool.py`

```python
# tools/database_reader_tool.py

from crewai.tools import BaseTool
from sqlalchemy import create_engine, text
import os

class DatabaseReaderTool(BaseTool):
    name: str = "Leitor de Banco de Dados"
    description: str = (
        "Conecta a um banco de dados e executa consultas SQL para obter informações. "
        "Use consultas SELECT para ler dados. Exemplo: 'SELECT * FROM hotels WHERE city = 'Paris'"
    )

    def _run(self, query: str) -> str:
        # Obter string de conexão do .env
        database_url = os.getenv("DATABASE_URL")

        if not database_url:
            return "Erro: DATABASE_URL não está definida no .env"

        try:
            # Conectar ao banco
            engine = create_engine(database_url)
            with engine.connect() as connection:
                result = connection.execute(text(query))
                rows = result.fetchall()

                if not rows:
                    return "Nenhum resultado encontrado."

                # Converter resultados para string
                columns = list(result.keys())
                output = [", ".join(columns)]
                for row in rows:
                    output.append(", ".join(str(cell) for cell in row))

                return "\n".join(output)

        except Exception as e:
            return f"Erro na consulta: {str(e)}"

    async def _arun(self, query: str) -> str:
        raise NotImplementedError("Método assíncrono não suportado.")
```

---

### 🔧 Passo 3: Adicione ao `.env`

#### Para PostgreSQL:
```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
```

#### Para MySQL:
```env
DATABASE_URL=mysql+pymysql://usuario:senha@localhost:3306/nome_do_banco
```

#### Para SQLite:
```env
DATABASE_URL=sqlite:///banco.db
```

---

### 🔧 Passo 4: Crie um agente que use a ferramenta

Adicione no seu `travel_agents.py`:

```python
from tools.database_reader_tool import DatabaseReaderTool

# Ferramenta para ler banco de dados
db_tool = DatabaseReaderTool()

pesquisador_db = Agent(
    role="Pesquisador de Dados de Banco",
    goal="Consultar o banco de dados para encontrar informações atualizadas",
    backstory="Você tem acesso a um banco de dados com informações de interesse para os relatórios de viagens.",
    tools=[db_tool],
    verbose=True
)
```

---

### 🔧 Passo 5: Crie uma tarefa que use essa ferramenta

Adicione no seu `travel_tasks.py`:

```python
from travel_agents import pesquisador_db

pesquisar_dados_db = Task(
    description=(
        "Consulte o banco de dados para encontrar informações relacionadas ao Relatório gerado pelo Escritor de Viagens"
        "Cite as informações que possam ser úteis de acordo com o Relatório da Viagem"
    ),
    expected_output="Comentários extras com base no Banco de Dados. Esses comentários devem ter pertinência e serem sucintos. Resuma as informações analisadas no banco de dados. Cite o nome das tabelas consultadas no banco de dados.",
    agent=pesquisador_db
)
```

---

### 🔧 Passo 6: Atualize o `main.py`

Adicione o novo agente e tarefa:

```python
# main.py

from crewai import Crew
from travel_agents import (
    pesquisador_viagem,
    planejador_roteiros,
    escritor_viagens,
    avaliador_viagem,
    pesquisador_db  # ← Novo agente
)
from travel_tasks import (
    pesquisar_destinos,
    planejar_itinerario,
    escrever_relatorio,
    avaliar_relatorio,
    pesquisar_dados_db  # ← Nova tarefa
)

if __name__ == "__main__":
    trip_crew = Crew(
        agents=[
            pesquisador_viagem,
            planejador_roteiros,
            escritor_viagens,
            avaliador_viagem,
            pesquisador_db  # ← Novo agente
        ],
        tasks=[
            pesquisar_destinos,
            planejar_itinerario,
            escrever_relatorio,
            avaliar_relatorio,
            pesquisar_dados_db  # ← Nova tarefa
        ],
        process="sequential",
        verbose=True
    )

    result = trip_crew.kickoff()
    print("\n" + "="*50)
    print("Relatório Final de Viagem")
    print("="*50)
    print(result)
```

---

### ✅ Resultado esperado

Agora seu agente pode:
- Consultar bancos de dados,
- Obter informações atualizadas,
- Incorporar esses dados no relatório de viagem.

---

### 🧠 Dica: Segurança

- Nunca use consultas SQL diretamente do usuário (risco de SQL Injection).
- Valide e limpe os inputs antes de executar.
- Use **SQLAlchemy** com **parâmetros nomeados** para consultas dinâmicas.

---

## Vamos criar um **banco de dados de exemplo com hotéis**, para que você possa testar a funcionalidade do agente que acessa o banco.

### ✅ Passo a Passo: Criar Banco de Dados com Dados de Exemplo

Vamos usar **SQLite** (porque é mais fácil para testar localmente) e criar uma tabela `hotels` com dados reais.

#### 🔧 Passo 1: Crie um script para gerar o banco de dados

Crie um arquivo: `setup_database.py`

```python
# setup_database.py

from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuração do banco
DATABASE_URL = "sqlite:///banco.db"

engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Definir a tabela de hotéis
class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    price_per_night = Column(Float, nullable=False)
    rating = Column(Float, nullable=False)  # de 1 a 5
    availability = Column(Integer, nullable=False)  # número de quartos disponíveis

# Criar tabelas
Base.metadata.create_all(engine)

# Dados de exemplo
hotels_data = [
    {"name": "Hotel Plaza", "city": "Paris", "price_per_night": 95.0, "rating": 4.5, "availability": 12},
    {"name": "Le Petit Paris", "city": "Paris", "price_per_night": 78.0, "rating": 4.2, "availability": 8},
    {"name": "Grand Palace", "city": "Paris", "price_per_night": 120.0, "rating": 4.8, "availability": 5},
    {"name": "Chic Boutique", "city": "Paris", "price_per_night": 85.0, "rating": 4.3, "availability": 15},
    {"name": "Riviera Resort", "city": "Nice", "price_per_night": 110.0, "rating": 4.6, "availability": 7},
    {"name": "Sunset Beach", "city": "Nice", "price_per_night": 90.0, "rating": 4.1, "availability": 10},
    {"name": "Mountain Lodge", "city": "Lyon", "price_per_night": 80.0, "rating": 4.0, "availability": 6},
    {"name": "City Center Inn", "city": "Lyon", "price_per_night": 65.0, "rating": 3.9, "availability": 20},
]

# Inserir dados
Session = sessionmaker(bind=engine)
session = Session()

for hotel_data in hotels_data:
    hotel = Hotel(**hotel_data)
    session.add(hotel)

session.commit()
session.close()

print("Banco de dados criado com sucesso!")
print("Arquivo: banco.db")
```

---

#### 🔧 Passo 2: Execute o script

```bash
python setup_database.py
```

Isso criará:
- Um arquivo `banco.db` (seu banco SQLite),
- Com uma tabela `hotels`,
- E 8 hotéis de exemplo em Paris, Nice e Lyon.

---

#### 🔧 Passo 3: Atualize seu `.env`

Adicione a linha:

```env
DATABASE_URL=sqlite:///banco.db
```

---

#### 🔧 Passo 4: Teste a consulta no agente

Agora, quando você rodar:

```bash
python main.py
```

---

#### 🧪 Dica: Consultas que você pode testar
Gere o arquivo `test_query.py`
```python
from sqlalchemy import create_engine, text

# Conectar ao banco
DATABASE_URL = "sqlite:///banco.db"
engine = create_engine(DATABASE_URL)

# Consulta desejada
query = """
SELECT * FROM hotels 
WHERE city = 'Paris' AND price_per_night < 100 
ORDER BY rating DESC 
LIMIT 5;
"""

with engine.connect() as connection:
    result = connection.execute(text(query))
    rows = result.fetchall()
    columns = list(result.keys())

    print("Resultado da consulta:")
    print(", ".join(columns))
    for row in rows:
        print(", ".join(str(cell) for cell in row))
```
Demais Queries para testar:
```sql
SELECT name, price_per_night, rating FROM hotels WHERE city = 'Nice' ORDER BY price_per_night ASC;
```

```sql
SELECT name, price_per_night, rating FROM hotels WHERE city = 'Nice' ORDER BY price_per_night ASC;
```

```sql
SELECT name, city, price_per_night, availability FROM hotels WHERE availability > 10;
```

```sql
SELECT * FROM hotels WHERE rating > 4.5 ORDER BY price_per_night ASC;
```
---

#### ✅ Resultado

Agora você tem:
- Um banco de dados SQLite com dados de hotéis,
- Um agente que pode consultar esses dados,
- Um exemplo funcional de integração com banco de dados.
