Feature: Pagamento

  Scenario: Cria um novo pagamento
    Given recebe um pagamento na fila e crio no banco
    When eu invoco a api de de pagamento
    Then deve retornar os dados do pagamento criado 
    And o status da resposta deve ser 200

  Scenario: Muda status do pagamento
    Given existe um pagamento criado
    When eu invoco a api para mudar o status do pagamento
    Then deve retornar a confirmacao da mudanca
    And o status da mudanca do pagamento deve ser 200
  
  Scenario: Muda status do pagamento já processado
    Given existe um pagamento que já foi processado
    When eu invoco a api para mudar o status do pagamento já processado
    Then deve retornar a mensagem que já foi processado
    And o status do erro deve ser 200
