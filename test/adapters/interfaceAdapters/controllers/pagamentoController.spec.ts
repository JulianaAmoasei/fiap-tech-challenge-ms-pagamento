import PagamentoController from "../../../../src/adapters/interfaceAdapters/controllers/pagamentoController";
import PagamentoRepository from "../../../../src/adapters/repositories/database/pagamentoRepository";
import { statusPagamento } from "../../../../src/domain/entities/types/pagamentoType";
describe("pagamento controller", () => {
  it("listaPagamento deve chamar PagamentoRepository", async () => {
    const id = "123";
    const pagamento = {
      _id: "123",
      pedidoId: "123",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
    };
    const listaPagamentoMock = jest
      .spyOn(PagamentoRepository, "listaPagamento")
      .mockResolvedValue(pagamento);

    const result = await PagamentoController.listaPagamento(id);

    expect(listaPagamentoMock).toHaveBeenCalledWith(id);
    expect(result).toEqual(pagamento);

    listaPagamentoMock.mockRestore();
  });
});
