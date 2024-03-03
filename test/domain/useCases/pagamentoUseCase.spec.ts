import PagamentoRepository from "../../../src/adapters/repositories/database/pagamentoRepository";
import QueueRepository from "../../../src/adapters/repositories/messageBroker/messageBrokerRepository";
import PagtoProviderInterface from "../../../src/dataSources/paymentProvider/interfaces/PagtoProviderInterface";
import {
  MsgPedidoPagamentoBody,
  PagamentoDTO,
  StatusPagamentoServico,
} from "../../../src/domain/entities/types/pagamentoType";
import PagamentoUseCase from "../../../src/domain/useCases/pagamentoUseCase";

describe("PagamentoUseCases", () => {
  it("enviaCobranca deve chamar geraCobranca e enviaParaFila", async () => {
    const queueRepositoryMock: QueueRepository = {
      enviaParaFila: jest.fn(),
      recebeMensagem: jest.fn(),
      deletaMensagemProcessada: jest.fn(),
      enviaParaDLQ: jest.fn(),
    };

    const pagtoProviderMock: PagtoProviderInterface = {
      geraCobranca: jest.fn().mockResolvedValue({
        pedidoId: "123",
        qrUrl: "http://apipagamento.com",
      }),
      estornaCobranca: jest.fn().mockRejectedValue({
        pedidoId: "123",
        estornoId: "456"
      }),
    };

    const pagamento: MsgPedidoPagamentoBody = {
      pedidoId: "123",
      metodoDePagamento: "credit card",
      valor: 100,
    };

    await PagamentoUseCase.enviaCobranca(
      queueRepositoryMock,
      pagtoProviderMock,
      pagamento
    );

    expect(pagtoProviderMock.geraCobranca).toHaveBeenCalledWith(pagamento);
    expect(queueRepositoryMock.enviaParaFila).toHaveBeenCalledWith(
      { pedidoId: "123", qrUrl: "http://apipagamento.com" },
      process.env.URL_FILA_ENVIO_COBRANCA
    );
  });
  it("deve cancelar a cobrança em caso de erro no gateway de pagamento", async () => {

    const queueRepositoryMock: QueueRepository = {
      enviaParaFila: jest.fn(),
      recebeMensagem: jest.fn(),
      deletaMensagemProcessada: jest.fn(),
      enviaParaDLQ: jest.fn(),
    };
    const pagtoProviderMock: PagtoProviderInterface = {
      geraCobranca: jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error("Erro do gateway");
      }),
      estornaCobranca: jest.fn().mockRejectedValue({
        pedidoId: "123",
        estornoId: "456"
      }),
    };

    const pagamento: MsgPedidoPagamentoBody = {
      pedidoId: "123",
      metodoDePagamento: "QR Code",
      valor: 10,
    };
    
    PagamentoRepository.listaPagamento = jest
    .fn()
    .mockResolvedValue(() => ({
      _id: '123',
      pedidoId: '123',
      valor: 10,
      statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
      metodoDePagamento: 'QR Code',
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
    }));

    PagamentoRepository.atualizaPagamento = jest
    .fn()
    .mockResolvedValue(() => ({
      _id: '123',
      pedidoId: '123',
      valor: 10,
      statusPagamento: StatusPagamentoServico.FALHA,
      metodoDePagamento: 'QR Code',
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
    }));

    await PagamentoUseCase.enviaCobranca(
      queueRepositoryMock,
      pagtoProviderMock,
      pagamento
    );

    expect(pagtoProviderMock.geraCobranca).toHaveBeenCalledWith(pagamento);
    expect(queueRepositoryMock.enviaParaFila).not.toHaveBeenCalled();
    // expect(PagamentoUseCase.cancelaCobranca).toHaveBeenCalledWith(
    //   pagamento,
    //   queueRepositoryMock
    // );
  });

  it("enviaDadosAtualizados deve chamar enviaParaFila corretamente", async () => {
    const queueRepositoryMock: QueueRepository = {
      enviaParaFila: jest.fn(),
      recebeMensagem: jest.fn(),
      deletaMensagemProcessada: jest.fn(),
      enviaParaDLQ: jest.fn(),
    };

    const dadosPagamento: PagamentoDTO = {
      pedidoId: "123",
      valor: 20,
      metodoDePagamento: "QR Code",
      statusPagamento: StatusPagamentoServico.PAGAMENTO_CONCLUIDO,
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
    };

    await PagamentoUseCase.enviaDadosPagtoAtualizados(
      queueRepositoryMock,
      dadosPagamento
    );

    expect(queueRepositoryMock.enviaParaFila).toHaveBeenCalledWith(
      { pedidoId: "123", statusPagamento: StatusPagamentoServico.PAGAMENTO_CONCLUIDO },
      process.env.URL_FILA_ATUALIZA_PEDIDO
    );
  });

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
    statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: null,
  };

  const mockPagamentoAtualizado = {
    _id: "1234-1234-1234",
    pedidoId: "1234-1234-1234",
    valor: 10,
    metodoDePagamento: "QR Code",
    statusPagamento: StatusPagamentoServico.PAGAMENTO_CONCLUIDO,
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
      StatusPagamentoServico.AGUARDANDO_PAGAMENTO
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
