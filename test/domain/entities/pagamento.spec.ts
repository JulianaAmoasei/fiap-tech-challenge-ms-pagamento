// import { v4 as uuidv4 } from "uuid";

import Pagamento from "../../../src/domain/entities/Pagamento";
import { PagamentoInput,statusPagamento } from "../../../src/domain/entities/types/pagamentoType";

describe("Pagamento", () => {
  it("deve criar uma nova instância de Pagamento", () => {
    const pagamentoInput: PagamentoInput = {
      pedidoId: "1234-1234-1234",
      valor: 10,
      metodoDePagamento: "QR Core",
      statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
    };

    const pagamento = new Pagamento(pagamentoInput);

    expect(pagamento._id).toBeDefined();
    expect(pagamento.pedidoId).toBe(pagamentoInput.pedidoId);
    expect(pagamento.valor).toBe(pagamentoInput.valor);
    expect(pagamento.metodoDePagamento).toBe(pagamentoInput.metodoDePagamento);
    expect(pagamento.statusPagamento).toBe(pagamentoInput.statusPagamento);
    expect(pagamento.createdAt).toBe(pagamentoInput.createdAt);
    expect(pagamento.deletedAt).toBeNull();
    expect(pagamento.updatedAt).toBeNull();
  });

      it('deve gerar um _id', () => {
        const pagamentoInput: PagamentoInput = {
          pedidoId: "1234-1234-1234",
          valor: 10,
          metodoDePagamento: "QR Code",
          statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
          createdAt: new Date(),
          deletedAt: null,
          updatedAt: null
        };
  
        const pagamento = new Pagamento(pagamentoInput);
  
        expect(pagamento._id).toBeDefined();
        expect(typeof pagamento._id).toBe("string");
      });
});
