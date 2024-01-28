/* eslint-disable @typescript-eslint/no-explicit-any */
import PagamentoController from '../../../../../src/adapters/interfaceAdapters/controllers/pagamentoController'
import { queueCheck } from "../../../../../src/adapters/interfaceAdapters/queues/consumers/filaEnvioPagamento";
import MessageBrokerService from "../../../../../src/dataSources/messageBroker/messageBrokerService";
import {
  statusPagamento,
} from "../../../../../src/domain/entities/types/pagamentoType";



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
    receiptHandle:'handle',
    body:{ pedidoId: "123", metodoDePagamento: "QR Code", valor: 100 }
  };
  const URL_FILA_ENVIO_PAGAMENTO = process.env.URL_FILA_ENVIO_PAGAMENTO
 
  it("deve receber e processar mensagens da fila", async () => {

    const queueServiceMock = MessageBrokerService.prototype.recebeMensagem = jest.fn().mockResolvedValue([mensagemPagamentoMock] as any)
    const recebePagamentoMock = PagamentoController.recebePagamento = jest.fn().mockResolvedValue(objPagamentoMock as any);
    const deletaMensagemProcessadaMock = MessageBrokerService.prototype.deletaMensagemProcessada = jest.fn().mockResolvedValue(true)
  
    await queueCheck();

    expect(queueServiceMock).toHaveBeenCalledWith(URL_FILA_ENVIO_PAGAMENTO);
    expect(recebePagamentoMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      { pedidoId: "123", metodoDePagamento: "QR Code", valor: 100 }
    );
    expect(deletaMensagemProcessadaMock).toHaveBeenCalledWith(
      URL_FILA_ENVIO_PAGAMENTO,
      expect.any(String)
    );
  });

});
