# Requisitos Funcionais
[]Criar Usuário (User)
[]Identificar Usuário entre as requisições
[]Registrar refeições feitas
[]Editar Refeição
[]Listar Refeições por usuário (ListAll)
[]Visualizar uma refeição (ListById)
[]Recuperar Métricas dos usuários
    []Qtde Refeição registradas
    []Qtde Refeição dentro da dieta
    []Qtde Refeição fora da dieta
    []Melhor sequencia de refeições fora da dieta
[]CRUD por usuário

# Estrutura BD
[]Tabela de Usuários (users - migrate)
    []ID (UUID)
    []Nome (Name: String)
    []Data de Criação (CreatedAt: Timestamp)
[]Tabela de refeições (meals - migrate)
    []Nome  (Name: String)
    []Descrição (Description: String)
    []Data e Hora (CreatedAt: Timestamp)
    []Dentro ou não da dieta (Diet: Boolean)
    []ID Usuario (userId: UUID)

