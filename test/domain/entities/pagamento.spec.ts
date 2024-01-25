import { v4 as uuidv4 } from "uuid";

import Pagamento from "../../../src/domain/entities/Pagamento";
import { statusPagamento } from "../../../src/domain/entities/types/pagamentoType";

describe('Pagamento', () => {
  it('Teste criar novo pagamento', async () => {
    const pagamento = new Pagamento({
      _id: uuidv4(),
      pedidoId: uuidv4(),
      valor: 10,
      metodoDePagamento: 'QR Code',
      statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    });

    expect(pagamento.statusPagamento).toBe('Aguardando pagamento');
  });
});