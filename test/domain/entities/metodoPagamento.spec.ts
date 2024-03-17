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
    expect(pagamento.ativo).toBe(true);
    expect(pagamento.createdAt).toBe(createdAt);
    expect(pagamento.deletedAt).toBe(null);
    expect(pagamento.updatedAt).toBe(null);
  });
});