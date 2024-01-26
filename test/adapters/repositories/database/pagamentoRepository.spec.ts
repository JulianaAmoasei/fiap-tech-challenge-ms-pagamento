import PagamentoRepository, {
  pagamentoModel,
} from "../../../../src/adapters/repositories/database/pagamentoRepository";
import {
  PagamentoDTO,
  statusPagamento,
} from "../../../../src/domain/entities/types/pagamentoType";

describe("pagamento repository", () => {
  const createdAt = new Date();
  it("Deve criar um pagamento", async () => {
    const pagamento: PagamentoDTO = {
      _id: "1234-1234-1234",
      pedidoId: "1234-1234-1234",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    pagamentoModel.pagamento.create = jest.fn().mockResolvedValue({
      _id: "1234-1234-1234",
      pedidoId: "1234-1234-1234",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    });

    const novoPagamento = await PagamentoRepository.criaPagamento(pagamento);
    expect(novoPagamento).toMatchObject(pagamento);
  });

  it("Deve retornar um pagamento pelo id", async () => {
    const pedidoId = "1234-1234-1234";
    const pagamento: PagamentoDTO = {
      _id: "1234-1234-1234",
      pedidoId: "1234-1234-1234",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    pagamentoModel.pagamento.findOne = jest.fn().mockResolvedValue({
      _id: "1234-1234-1234",
      pedidoId: "1234-1234-1234",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    });

    const novoPagamento = await PagamentoRepository.listaPagamento(pedidoId);
    expect(novoPagamento).toMatchObject(pagamento);
  });

  it("Deve atualizar um pagamento pelo id", async () => {
    const pedidoId = "1234-1234-1234";
    const pagamento: PagamentoDTO = {
      _id: "1234-1234-1234",
      pedidoId: "1234-1234-1234",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: statusPagamento.PAGAMENTO_CONCLUIDO,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    pagamentoModel.pagamento.findByIdAndUpdate = jest.fn().mockResolvedValue({
      _id: "1234-1234-1234",
      pedidoId: "1234-1234-1234",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: statusPagamento.PAGAMENTO_CONCLUIDO,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    });

    const pagamentoAtualizado = await PagamentoRepository.atualizaPagamento(
      pedidoId,
      pagamento
    );
    expect(pagamentoAtualizado).toMatchObject(pagamento);
    expect(pagamentoAtualizado?.statusPagamento).toBe("Pagamento concluído");
  });
});
