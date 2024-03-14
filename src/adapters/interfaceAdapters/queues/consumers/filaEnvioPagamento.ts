import PagamentoController from "adapters/interfaceAdapters/controllers/pagamentoController";
import MessageBrokerService from "dataSources/messageBroker/messageBrokerService";
import PagtoProvider from "dataSources/paymentProvider/pagtoProvider";

import { MsgPedidoPagamentoBody } from "~domain/entities/types/pagamentoType";

const URL_FILA_ENVIO_PAGAMENTO = process.env.URL_FILA_ENVIO_PAGAMENTO as string;
const URL_FILA_ENVIO_PAGAMENTO_DLQ = process.env.URL_FILA_ENVIO_PAGAMENTO_DLQ as string;

const queueService = new MessageBrokerService();
const pagtoProvider = new PagtoProvider();

export async function queueCheck() {
  const mgsPagtos = await queueService.recebeMensagem<MsgPedidoPagamentoBody>(
    URL_FILA_ENVIO_PAGAMENTO
  );
  return mgsPagtos?.map(async (pagamento) => {
    try {
      await PagamentoController.recebePagamento(queueService, pagtoProvider, pagamento.body);
      await queueService.deletaMensagemProcessada(
        URL_FILA_ENVIO_PAGAMENTO,
        pagamento.receiptHandle as string
      );
    } catch (err) {
      console.error(err);
      queueService.enviaParaDLQ(
        URL_FILA_ENVIO_PAGAMENTO,
        URL_FILA_ENVIO_PAGAMENTO_DLQ,
        {
          Body: JSON.stringify(pagamento.body),
          ReceiptHandle: pagamento.receiptHandle as string,
        }
      );
    }
    return null;
  });
}
export default async function MonitoramentoPagamentos() {
  console.log(`Buscando mensagens na fila ${URL_FILA_ENVIO_PAGAMENTO}`);
  await queueCheck();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await MonitoramentoPagamentos();
}
