import PagamentoController from "adapters/interfaceAdapters/controllers/pagamentoController";
import MessageBrokerService from "dataSources/messageBroker/messageBrokerService";
import PagtoProvider from "dataSources/paymentProvider/pagtoProvider";

import { MsgPedidoPagamentoBody } from "~domain/entities/types/pagamentoType";

const FILA_ENVIO_PAGAMENTO = process.env.FILA_ENVIO_PAGAMENTO as string;
const FILA_PAGAMENTO_DLQ_URL = process.env.FILA_PAGAMENTO_DLQ_URL as string;

const queueService = new MessageBrokerService();
const pagtoProvider = new PagtoProvider();

async function queueCheck() {
  const pagamentos = await queueService.recebeMensagem<MsgPedidoPagamentoBody>(
    FILA_ENVIO_PAGAMENTO
  );
  return pagamentos?.map(async (pagamento) => {
    try {
      await PagamentoController.recebePagamento(queueService, pagtoProvider, pagamento.body);
      await queueService.deletaMensagemProcessada(
        FILA_ENVIO_PAGAMENTO,
        pagamento.receiptHandle as string
      );
    } catch (err) {
      console.log(err);
      queueService.enviaParaDLQ(FILA_ENVIO_PAGAMENTO, FILA_PAGAMENTO_DLQ_URL, {
        Body: JSON.stringify(pagamento.body),
        ReceiptHandle: pagamento.receiptHandle as string,
      });
    }
    return null;
  });
}
export default async function QueueMonitoring() {
  console.log(`Buscando mensagens na fila ${FILA_ENVIO_PAGAMENTO}`);
  await queueCheck();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  await QueueMonitoring();
}
