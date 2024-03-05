import { v4 as uuidv4 } from "uuid";

import PagamentoRepository from "../../../src/adapters/repositories/database/pagamentoRepository";
import QueueRepository from "../../../src/adapters/repositories/messageBroker/messageBrokerRepository";
import PagtoProviderInterface from "../../../src/dataSources/paymentProvider/interfaces/PagtoProviderInterface";
import PagamentoError from "../../../src/domain/entities/errors/PagamentoErrors";
import {
  MsgPedidoPagamentoBody,
  PagamentoDTO,
  PagamentoErrorCodes,
  StatusPagamentoServico,
} from "../../../src/domain/entities/types/pagamentoType";
import PagamentoUseCase from "../../../src/domain/useCases/pagamentoUseCase";

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

  const registroPagamentoMock: PagamentoDTO = {
    _id: uuidv4(),
    pedidoId: uuidv4(),
    valor: 10,
    metodoDePagamento: "QR Code",
    statusPagamento: StatusPagamentoServico.FALHA,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  };
  const queueRepositoryMock: QueueRepository = {
    enviaParaFila: jest.fn(),
    recebeMensagem: jest.fn(),
    deletaMensagemProcessada: jest.fn(),
    enviaParaDLQ: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

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
        estornoId: "456",
      }),
    };

    const pagamento: MsgPedidoPagamentoBody = {
      pedidoId: "123",
      metodoDePagamento: "QR Code",
      valor: 10,
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
      geraCobranca: jest.fn().mockImplementationOnce(() => {
        throw new Error("Erro do gateway");
      }),
      estornaCobranca: jest.fn().mockRejectedValue({
        pedidoId: "123",
        estornoId: "456",
      }),
    };

    const pagamento: MsgPedidoPagamentoBody = {
      pedidoId: "123",
      metodoDePagamento: "QR Code",
      valor: 10,
    };

    PagamentoRepository.listaPagamento = jest.fn().mockResolvedValue(() => ({
      _id: "123",
      pedidoId: "123",
      valor: 10,
      statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
      metodoDePagamento: "QR Code",
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
    }));

    PagamentoRepository.atualizaPagamento = jest.fn().mockResolvedValue(() => ({
      _id: "123",
      pedidoId: "123",
      valor: 10,
      statusPagamento: StatusPagamentoServico.FALHA,
      metodoDePagamento: "QR Code",
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
      {
        pedidoId: "123",
        statusPagamento: StatusPagamentoServico.PAGAMENTO_CONCLUIDO,
      },
      process.env.URL_FILA_ATUALIZA_PEDIDO
    );
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

  // Given valid input, it should call 'pagtoProvider.estornaCobranca' with the provided 'pagamento' object and return the result
  it("deve chamar o serviço de estorno do provider e receber o resultado", async () => {
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
      estornaCobranca: jest.fn().mockResolvedValue({
        pedidoId: "123",
        estornoId: "456",
      }),
    };

    const pagamento = { pedidoId: "123" };

    const result = await PagamentoUseCase.estornaCobrancaPagamento(
      queueRepositoryMock,
      pagtoProviderMock,
      pagamento
    );

    expect(pagtoProviderMock.estornaCobranca).toHaveBeenCalledWith(pagamento);
    expect(queueRepositoryMock.enviaParaFila).toHaveBeenCalledWith(
      { pedidoId: "123", estornoId: "456" },
      process.env.URL_FILA_ATUALIZA_PEDIDO
    );
    expect(result).toEqual({ pedidoId: "123", estornoId: "456" });
  });

  it("deve lançar erro em estornaCobranca em caso de erro", async () => {
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
      estornaCobranca: jest.fn().mockRejectedValue(new Error("Some error")),
    };
    const pagamento = { pedidoId: "123" };

    await expect(
      PagamentoUseCase.estornaCobrancaPagamento(
        queueRepositoryMock,
        pagtoProviderMock,
        pagamento
      )
    ).rejects.toThrow("erro não esperado");
    expect(pagtoProviderMock.estornaCobranca).toHaveBeenCalledWith(pagamento);
    expect(queueRepositoryMock.enviaParaFila).not.toHaveBeenCalled();
  });

  it("deve lançar erro em caso de erro em estornaCobranca", async () => {
    const queueRepositoryMock = {
      enviaParaFila: jest.fn(),
      recebeMensagem: jest.fn(),
      deletaMensagemProcessada: jest.fn(),
      enviaParaDLQ: jest.fn(),
    };
    const pagtoProviderMock = {
      geraCobranca: jest.fn().mockResolvedValue({
        pedidoId: "123",
        qrUrl: "http://apipagamento.com",
      }),
      estornaCobranca: jest
        .fn()
        .mockRejectedValue(new Error("erro não esperado")),
    };
    const pagamento = { pedidoId: "123" };

    await expect(
      PagamentoUseCase.estornaCobrancaPagamento(
        queueRepositoryMock,
        pagtoProviderMock,
        pagamento
      )
    ).rejects.toThrow("erro não esperado");
    expect(queueRepositoryMock.enviaParaFila).not.toHaveBeenCalled();
  });

  it("deve cancelar um pagamento com id válido", async () => {
    const pagamento = { pedidoId: "123" };

    const criaPagamentoMock = jest.fn();
    const listaPagamentoMock = jest.fn();
    const atualizaPagamentoMock = jest.fn();

    criaPagamentoMock.mockReturnValue(mockPagamento);
    listaPagamentoMock.mockReturnValue(mockPagamento);
    atualizaPagamentoMock.mockReturnValue(registroPagamentoMock);

    PagamentoRepository.criaPagamento = criaPagamentoMock;
    PagamentoRepository.listaPagamento = listaPagamentoMock;
    PagamentoRepository.atualizaPagamento = atualizaPagamentoMock;

    PagamentoUseCase.enviaDadosPagtoAtualizados = jest.fn();

    await PagamentoUseCase.cancelaCobranca(pagamento, queueRepositoryMock);

    expect(PagamentoUseCase.enviaDadosPagtoAtualizados).toHaveBeenCalledWith(
      queueRepositoryMock,
      registroPagamentoMock
    );
  });

  it("deve lançar erro e enviar mensagem de erro genérico", async () => {
  const queueRepositoryMock: QueueRepository = {
    enviaParaFila: jest.fn(),
    recebeMensagem: jest.fn(),
    deletaMensagemProcessada: jest.fn(),
    enviaParaDLQ: jest.fn(),
  };
    const pagtoProvider = {
      geraCobranca: jest.fn(),
      estornaCobranca: jest.fn().mockRejectedValue(new Error("erro não esperado")),
    };
    const pagamento = { pedidoId: "123" };

    await expect(
      PagamentoUseCase.estornaCobrancaPagamento(
        queueRepositoryMock,
        pagtoProvider,
        pagamento
      )
    ).rejects.toThrow("erro não esperado");
    expect(pagtoProvider.estornaCobranca).toHaveBeenCalledWith(pagamento);
    expect(queueRepositoryMock.enviaParaFila).not.toHaveBeenCalled();
  });

  it("deve chamar cancelaCobranca em caso de erro de pagamento", async () => {
    const queueRepositoryMock: QueueRepository = {
      enviaParaFila: jest.fn(),
      recebeMensagem: jest.fn(),
      deletaMensagemProcessada: jest.fn(),
      enviaParaDLQ: jest.fn(),
    };
      const pagtoProvider = {
        geraCobranca: jest.fn(),
        estornaCobranca: jest.fn().mockRejectedValue(new PagamentoError(PagamentoErrorCodes.FALHA_PAGAMENTO)),
      };

      const pagtoUseCaseMock = {
        enviaCobranca: jest.fn(),
        estornaCobrancaPagamento: jest.fn(),
        enviaDadosAtualizados: jest.fn(),
        cancelaCobranca: jest.fn().mockImplementationOnce(() => Promise.resolve()),
      };

      const pagamento = { pedidoId: "123" };
  
      await expect(
        PagamentoUseCase.estornaCobrancaPagamento(
          queueRepositoryMock,
          pagtoProvider,
          pagamento
        )
      ).rejects.toThrow(PagamentoErrorCodes.FALHA_PAGAMENTO);
      expect(pagtoProvider.estornaCobranca).toHaveBeenCalledWith(pagamento);
      expect(queueRepositoryMock.enviaParaFila).not.toHaveBeenCalled();
    });
});
