import { v4 as uuidv4 } from "uuid";

import MetodoDePagamento from "../../../src/domain/entities/MetodoPagamento";

describe('MetodoPagamento Model', () => {
  it('Teste criar novo método de pagamento', async () => {
    const createdAt = new Date();
    const pagamento = new MetodoDePagamento({
      _id: uuidv4(),
      nome: "QR Code",
      ativo: true,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    });

    expect(pagamento.nome).toBe('QR Code');
  });
});