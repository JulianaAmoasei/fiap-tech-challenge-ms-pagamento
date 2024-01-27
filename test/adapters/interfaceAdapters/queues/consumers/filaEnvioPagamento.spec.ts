/* eslint-disable @typescript-eslint/no-explicit-any */
import PagamentoController from '../../../../../src/adapters/interfaceAdapters/controllers/pagamentoController'
import queueCheck from "../../../../../src/adapters/interfaceAdapters/queues/consumers/filaEnvioPagamento";
import MessageBrokerProvider from "../../../../../src/dataSources/messageBroker/messageBrokerService";
import pagtoProvider from "../../../../../src/dataSources/paymentProvider/pagtoProvider";
import {
  PagamentoDTO,
  StatusPagamento,
  statusPagamento,
} from "../../../../../src/domain/entities/types/pagamentoType";

const queueService = new MessageBrokerProvider();

class PagamentoMock implements PagamentoDTO {
  _id: string;
  pedidoId: string;
  valor: number;
  metodoDePagamento: string;
  statusPagamento: StatusPagamento;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  constructor(
    _id: string,
    pedidoId: string,
    valor: number,
    metodoDePagamento: string,
    statusPagamento: StatusPagamento,
    createdAt: Date,
    deletedAt: Date | null,
    updatedAt: Date | null
  ) {
    this._id = _id;
    this.pedidoId = pedidoId;
    this.valor = valor;
    this.metodoDePagamento = metodoDePagamento;
    this.statusPagamento = statusPagamento;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
    this.updatedAt = updatedAt;
  }
}

const objPagamentoMock = {
  _id: "123",
  pedidoId: "123",
  valor: 10,
  metodoDePagamento: "QR Code",
  statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
  createdAt: new Date(),
  deletedAt: null,
  updatedAt: null,
};

describe("queueCheck", () => {
  const mensagemPagamentoMock = {
    pedidoId: "123",
    metodoDePagamento: "QR Code",
    valor: 10,
  };
  const URL_FILA_ENVIO_PAGAMENTO = "http://aws.com/fila-pagamento";
  it("deve receber e processar mensagens da fila", async () => {
    const queueServiceMock = jest
      .spyOn(queueService, "recebeMensagem")
      .mockResolvedValue([
        {
          receiptHandle: "handle",
          body: { pedidoId: "1", metodoDePagamento: "QR Code", valor: 10 },
        },
      ]);
      
    const recebePagamentoMock = jest
      .spyOn(PagamentoController, "recebePagamento")
      .mockResolvedValue(objPagamentoMock as any);

    const deletaMensagemProcessadaMock = jest
      .spyOn(queueService, "deletaMensagemProcessada")
      .mockResolvedValue(true);

    await queueCheck();

    expect(queueServiceMock).toHaveBeenCalledWith(URL_FILA_ENVIO_PAGAMENTO);
    expect(recebePagamentoMock).toHaveBeenCalledWith(
      queueService,
      pagtoProvider,
      { pedidoId: "123", metodoDePagamento: "QR Code", valor: 100 }
    );
    expect(deletaMensagemProcessadaMock).toHaveBeenCalledWith(
      URL_FILA_ENVIO_PAGAMENTO,
      expect.any(String)
    );
  });

  // // Deletes processed messages from payment queue
  // it("should delete processed messages from payment queue", async () => {
  //   const queueServiceMock = jest
  //     .spyOn(queueService, "recebeMensagem")
  //     .mockResolvedValue([
  //       {
  //         body: { pedidoId: "123", metodoDePagamento: "QR Code", valor: 100 },
  //         receiptHandle: "123",
  //       },
  //     ]);
  //   const deletaMensagemProcessadaMock = jest
  //     .spyOn(queueService, "deletaMensagemProcessada")
  //     .mockResolvedValue();

  //   await queueCheck();

  //   expect(deletaMensagemProcessadaMock).toHaveBeenCalledWith(
  //     URL_FILA_ENVIO_PAGAMENTO,
  //     "123"
  //   );
  // });

  // // Sends updated payment data to queue after processing
  // it("should send updated payment data to queue after processing", async () => {
  //   const queueServiceMock = jest
  //     .spyOn(queueService, "recebeMensagem")
  //     .mockResolvedValue([
  //       {
  //         body: { pedidoId: "123", metodoDePagamento: "QR Code", valor: 100 },
  //         receiptHandle: "123",
  //       },
  //     ]);
  //   const recebePagamentoMock = jest
  //     .spyOn(PagamentoController, "recebePagamento")
  //     .mockResolvedValue();
  //   const enviaDadosPagtoAtualizadosMock = jest
  //     .spyOn(PagamentoUseCase, "enviaDadosPagtoAtualizados")
  //     .mockResolvedValue();

  //   await queueCheck();

  //   expect(enviaDadosPagtoAtualizadosMock).toHaveBeenCalled();
  // });

  // // Handles empty message queue gracefully
  // it("should handle empty message queue gracefully", async () => {
  //   const queueServiceMock = jest
  //     .spyOn(queueService, "recebeMensagem")
  //     .mockResolvedValue([]);

  //   await queueCheck();

  //   expect(queueServiceMock).toHaveBeenCalledWith(URL_FILA_ENVIO_PAGAMENTO);
  // });

  // // Handles missing receipt handle when deleting processed messages
  // it("should handle missing receipt handle when deleting processed messages", async () => {
  //   const queueServiceMock = jest
  //     .spyOn(queueService, "recebeMensagem")
  //     .mockResolvedValue([
  //       {
  //         body: { pedidoId: "123", metodoDePagamento: "QR Code", valor: 100 },
  //       },
  //     ]);
  //   const deletaMensagemProcessadaMock = jest
  //     .spyOn(queueService, "deletaMensagemProcessada")
  //     .mockResolvedValue();

  //   await queueCheck();

  //   expect(deletaMensagemProcessadaMock).toHaveBeenCalledWith(
  //     URL_FILA_ENVIO_PAGAMENTO,
  //     undefined
  //   );
  // });

  // // Handles missing payment data when processing messages
  // it("should handle missing payment data when processing messages", async () => {
  //   const queueServiceMock = jest
  //     .spyOn(queueService, "recebeMensagem")
  //     .mockResolvedValue([
  //       {
  //         body: { pedidoId: "123", metodoDePagamento: "QR Code", valor: 100 },
  //         receiptHandle: "123",
  //       },
  //     ]);
  //   const recebePagamentoMock = jest
  //     .spyOn(PagamentoController, "recebePagamento")
  //     .mockRejectedValue(new Error("Missing payment data"));
  //   const enviaParaDLQMock = jest
  //     .spyOn(queueService, "enviaParaDLQ")
  //     .mockResolvedValue();

  //   await queueCheck();

  //   expect(enviaParaDLQMock).toHaveBeenCalled();
  // });
});
