# Requisitos Funcionais
- [x]Criar Usuário (User)
- []Registrar refeições feitas
- []Editar Refeição
- [x]Listar Refeições por usuário (ListAll)
- [x]Visualizar uma refeição (ListById)
- []CRUD por usuário


# Regras de Negócio
- []Recuperar Métricas dos usuários
    []Qtde Refeição registradas
    []Qtde Refeição dentro da dieta
    []Qtde Refeição fora da dieta
    []Melhor sequencia de refeições dentro da dieta
- [x]Identificar Usuário entre as requisições

# Estrutura BD
- [✅]Tabela de Usuários (users - migrate)
    [x]ID (id: UUID)
    [x]Nome (name: String)
    [x]Data de Criação (createdAt: Timestamp)
    [x]ID de Sessão (sessionId: UUID)
- [✅]Tabela de refeições (meals - migrate)
    [x]ID (id: UUID)
    [x]Nome  (Name: String)
    [x]Descrição (Description: String)
    [x]Data e Hora (CreatedAt: Timestamp)
    [x]Dentro ou não da dieta (Diet: Boolean)
    [x]ID do Usuario (userId: UUID)

