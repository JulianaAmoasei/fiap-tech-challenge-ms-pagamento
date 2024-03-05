/* eslint-disable @typescript-eslint/no-explicit-any */
import PagamentoController from "../../../../../src/adapters/interfaceAdapters/controllers/pagamentoController";
import { queueCheck } from "../../../../../src/adapters/interfaceAdapters/queues/consumers/filaEnvioPagamento";
import MessageBrokerService from "../../../../../src/dataSources/messageBroker/messageBrokerService";
import { StatusPagamentoServico } from "../../../../../src/domain/entities/types/pagamentoType";

describe("queueCheck", () => {
  const objPagamentoEstornadoMock = {
    _id: "123",
    pedidoId: "123",
    valor: 10,
    metodoDePagamento: "QR Code",
    statusPagamento: StatusPagamentoServico.PAGAMENTO_ESTORNADO,
    estornoId: "456",
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: null,
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mensagemPagamentoMock = {
    receiptHandle: "handle",
    body: { pedidoId: "123" },
  };
  const URL_FILA_CANCELAMENTO_PEDIDO = process.env.URL_FILA_CANCELAMENTO_PEDIDO;

  it.skip("deve receber e processar mensagens da fila", async () => {
    const queueServiceMock = (MessageBrokerService.prototype.recebeMensagem =
      jest.fn().mockResolvedValue([mensagemPagamentoMock] as any));
    const estornaPagamentoMock = (PagamentoController.estornaPagamento = jest
      .fn()
      .mockResolvedValue(objPagamentoEstornadoMock as any));
    const deletaMensagemProcessadaMock =
      (MessageBrokerService.prototype.deletaMensagemProcessada = jest
        .fn()
        .mockResolvedValue(true));

    await queueCheck();

    expect(queueServiceMock).toHaveBeenCalledWith(URL_FILA_CANCELAMENTO_PEDIDO);
    expect(estornaPagamentoMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      { pedidoId: "123" }
    );
    expect(deletaMensagemProcessadaMock).toHaveBeenCalledWith(
      URL_FILA_CANCELAMENTO_PEDIDO,
      expect.any(String)
    );
  });
});
