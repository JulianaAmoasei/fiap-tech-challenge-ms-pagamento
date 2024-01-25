import PagamentoRepository from "../../../src/adapters/repositories/database/pagamentoRepository";
import { statusPagamento } from "../../../src/domain/entities/types/pagamentoType";

describe("PagamentoUseCases", () => {
  const mockMsgPagamento = {
    pedidoId: "1234-1234-1234",
    metodoDePagamento: "1234-1234-1234",
    valor: 10,
  };

  const mockPagamento = {
    _id: "1234-1234-1234",
    pedidoId: "1234-1234-1234",
    valor: 10,
    metodoDePagamento: "QR Code",
    statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: null,
  };

  const mockPagamentoAtualizado = {
    _id: "1234-1234-1234",
    pedidoId: "1234-1234-1234",
    valor: 10,
    metodoDePagamento: "QR Code",
    statusPagamento: statusPagamento.PAGAMENTO_CONCLUIDO,
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: new Date(),
  };

  const criaPagamentoMock = jest.fn();
  const listaPagamentoMock = jest.fn();
  const atualizaPagamentoMock = jest.fn();

  criaPagamentoMock.mockReturnValue(mockPagamento);
  listaPagamentoMock.mockReturnValue(mockPagamento);
  atualizaPagamentoMock.mockReturnValue(mockPagamentoAtualizado);

  beforeEach(() => {
    PagamentoRepository.criaPagamento = criaPagamentoMock;
    PagamentoRepository.listaPagamento = listaPagamentoMock;
    PagamentoRepository.atualizaPagamento = atualizaPagamentoMock;
  });

  it("Deve criar um pagamento com status AGUARDANDO_PAGAMENTO", async () => {
    const resultado = await PagamentoRepository.criaPagamento(mockMsgPagamento);
    expect(resultado.statusPagamento).toBe(
      statusPagamento.AGUARDANDO_PAGAMENTO
    );
  });

  it("deve retornar um pagamento através de pedidoId", async () => {
    const pedidoId = "1234-1234-1234";
    const resultado = await PagamentoRepository.listaPagamento(pedidoId);
    expect(resultado.pedidoId).toBe(pedidoId);
  });

  it("deve atualizar um pagamento pelo id", async () => {
    const id = "1234-1234-123";
    const result = await PagamentoRepository.atualizaPagamento(
      id,
      mockPagamentoAtualizado
    );

    expect(result).toEqual(mockPagamentoAtualizado);
  });

  // it("lista retorna null caso não encontre pagamento", async () => {
  //   const pedidoId = "123";
  //   const result = await PagamentoRepository.listaPagamento(pedidoId);
  //   expect(result).toBeNull();
  // });
});
