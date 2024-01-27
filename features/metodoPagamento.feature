Feature: Metodo pagameto

  Scenario: Lista os metodos de pagamento
    Given que o sistema de pagamento está ok
    When eu invoco a api de metodos de pagamento
    Then deve retornar um a lista dos metodos disponiveis no sistema 
    And o status da resposta do pagamento deve ser 200