import PagamentoController from "../../../../src/adapters/interfaceAdapters/controllers/pagamentoController";
import PagamentoRepository from "../../../../src/adapters/repositories/database/pagamentoRepository";
import MessageBrokerService from "../../../../src/dataSources/messageBroker/messageBrokerService";
import PagtoProviderInterface from "../../../../src/dataSources/paymentProvider/interfaces/PagtoProviderInterface";
import {
  PagamentoDTO,
  RecebimentoDePagamentoGatewayBody,
  StatusPagamentoServico,
} from "../../../../src/domain/entities/types/pagamentoType";
import PagamentoUseCase from "../../../../src/domain/useCases/pagamentoUseCase";

describe("pagamento controller", () => {
  const queueRepository = new MessageBrokerService();
  const pagtoProviderMock: PagtoProviderInterface = {
    geraCobranca: jest.fn(),
    estornaCobranca: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const date = new Date();

  it("deve chamar recebePagamento e enviar cobrança", async () => {
    PagamentoUseCase.enviaCobranca = jest.fn();
    PagamentoRepository.criaPagamento = jest.fn().mockResolvedValueOnce({
      _id: "123",
      pedidoId: "123",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
      createdAt: date,
      deletedAt: null,
      updatedAt: null,
    });

    const pagamento = {
      pedidoId: "123",
      metodoDePagamento: "QR Code",
      valor: 10,
    };

    await PagamentoController.recebePagamento(
      queueRepository,
      pagtoProviderMock,
      pagamento
    );

    expect(PagamentoUseCase.enviaCobranca).toHaveBeenCalledWith(
      queueRepository,
      pagtoProviderMock,
      pagamento
    );
  });

  it("listaPagamento deve chamar PagamentoRepository", async () => {
    const id = "123";
    const pagamento = {
      _id: "123",
      pedidoId: "123",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
      createdAt: date,
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

  it("chama estornaCobrancaPagamento com os parâmetros corretos", async () => {
    const dadosPagto = {
      _id: "123",
      pedidoId: "123",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: StatusPagamentoServico.PAGAMENTO_CONCLUIDO,
      createdAt: date,
      deletedAt: null,
      updatedAt: null,
    };
    const pagtoAtualizado = {
      _id: "123",
      pedidoId: "123",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: StatusPagamentoServico.PAGAMENTO_ESTORNADO,
      estornoId: "456",
      createdAt: date,
      deletedAt: null,
      updatedAt: null,
    };
    const pagtoEstornado = {
      pedidoId: "123",
      estornoId: "456",
    };

    jest
      .spyOn(PagamentoUseCase, "estornaCobrancaPagamento")
      .mockResolvedValue(pagtoEstornado);
    jest
      .spyOn(PagamentoRepository, "listaPagamento")
      .mockResolvedValue(dadosPagto);
    jest
      .spyOn(PagamentoRepository, "atualizaPagamento")
      .mockResolvedValue(pagtoAtualizado);

    const result = await PagamentoController.estornaPagamento(
      queueRepository,
      pagtoProviderMock,
      { pedidoId: "123" }
    );

    expect(PagamentoUseCase.estornaCobrancaPagamento).toHaveBeenCalledWith(
      queueRepository,
      pagtoProviderMock,
      { pedidoId: "123" }
    );
    expect(PagamentoRepository.listaPagamento).toHaveBeenCalledWith(
      dadosPagto.pedidoId
    );
    // expect(PagamentoRepository.atualizaPagamento).toHaveBeenCalledWith(dadosPagto._id, pagtoAtualizado);
    expect(result).toHaveProperty("estornoId");
  });

  it("deve atualizar status para 'PAGAMENTO_CONCLUIDO' quando 'pagamentoEfetuado' é verdadeiro & statusPagamento é 'AGUARDANDO_PAGAMENTO'", async () => {
    const queueService: MessageBrokerService = new MessageBrokerService();

    const resultPagamentoResponse: RecebimentoDePagamentoGatewayBody = {
      pedidoId: "123",
      pagamentoEfetuado: true,
    };
    const dadosPagto: PagamentoDTO = {
      _id: "123",
      pedidoId: "123",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
    };
    const pagtoAtualizado: PagamentoDTO = {
      _id: "123",
      pedidoId: "123",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: StatusPagamentoServico.PAGAMENTO_CONCLUIDO,
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
    };
    jest
      .spyOn(PagamentoRepository, "listaPagamento")
      .mockResolvedValue(dadosPagto);
    jest
      .spyOn(PagamentoRepository, "atualizaPagamento")
      .mockResolvedValue(pagtoAtualizado);
    const enviaDadosPagtoAtualizadosSpy = jest.spyOn(
      PagamentoUseCase,
      "enviaDadosPagtoAtualizados"
    );

    const result = await PagamentoController.atualizaStatusPagamento(
      queueService,
      resultPagamentoResponse
    );

    expect(result).toEqual(pagtoAtualizado);
    expect(enviaDadosPagtoAtualizadosSpy).toHaveBeenCalledWith(
      queueService,
      pagtoAtualizado
    );
  });

  it("deve lançar erro em caso de pagamento inexistente", async () => {
    const queueService: MessageBrokerService = new MessageBrokerService();
    const resultPagamentoResponse: RecebimentoDePagamentoGatewayBody = {
      pedidoId: "000",
      pagamentoEfetuado: true,
    };
    jest.spyOn(PagamentoRepository, "listaPagamento").mockResolvedValue(null);

    await expect(
      PagamentoController.atualizaStatusPagamento(
        queueService,
        resultPagamentoResponse
      )
    ).rejects.toThrow("pagamento nao encontrado");
  });
});
