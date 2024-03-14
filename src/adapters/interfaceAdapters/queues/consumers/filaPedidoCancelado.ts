import PagamentoController from "adapters/interfaceAdapters/controllers/pagamentoController";
import MessageBrokerService from "dataSources/messageBroker/messageBrokerService";
import PagtoProvider from "dataSources/paymentProvider/pagtoProvider";

import { MsgCancelamentoPedidoBody } from "~domain/entities/types/pagamentoType";

const URL_FILA_CANCELAMENTO_PEDIDO = process.env.URL_FILA_CANCELAMENTO_PEDIDO as string;
const URL_FILA_CANCELAMENTO_PEDIDO_DLQ = process.env.URL_FILA_CANCELAMENTO_PEDIDO_DLQ as string;

const queueService = new MessageBrokerService();
const pagtoProvider = new PagtoProvider();

export async function queueCheck() {
  const mgsPagtosCancelados = await queueService.recebeMensagem<MsgCancelamentoPedidoBody>(
    URL_FILA_CANCELAMENTO_PEDIDO
  );
  return mgsPagtosCancelados?.map(async (pagamento) => {
    try {
      await PagamentoController.estornaPagamento(queueService, pagtoProvider, pagamento.body);
      await queueService.deletaMensagemProcessada(
        URL_FILA_CANCELAMENTO_PEDIDO,
        pagamento.receiptHandle as string
      );
    } catch (err) {
      console.error(err);
      queueService.enviaParaDLQ(
        URL_FILA_CANCELAMENTO_PEDIDO,
        URL_FILA_CANCELAMENTO_PEDIDO_DLQ,
        {
          Body: JSON.stringify(pagamento.body),
          ReceiptHandle: pagamento.receiptHandle as string,
        }
      );
    }
    return null;
  });
}
export default async function MonitoramentoCancelamentos() {
  console.log(`Buscando mensagens na fila ${URL_FILA_CANCELAMENTO_PEDIDO}`);
  await queueCheck();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await MonitoramentoCancelamentos();
}
