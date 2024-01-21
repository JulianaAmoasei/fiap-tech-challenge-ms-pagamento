import PagamentoController from "adapters/interfaceAdapters/controllers/pagamentoController";
import MessageBrokerService from "dataSources/messageBroker/messageBrokerService";

import { SendPaymentQueueBody } from "~domain/entities/types/pagamentoType";

const FILA_ENVIO_PAGAMENTO = process.env.FILA_ENVIO_PAGAMENTO as string;
const DLQ_ENVIO_PAGAMENTO = process.env.DLQ_ENVIO_PAGAMENTO as string;

const queueService = new MessageBrokerService();

async function queueCheck() {
  const pagamentos = await queueService.recebeMensagem<SendPaymentQueueBody>(
    FILA_ENVIO_PAGAMENTO
  );
  return pagamentos?.map(async (pagamento) => {
    try {
      await PagamentoController.recebePagamento(pagamento.body);
      await queueService.deletaMensagemProcessada(
        FILA_ENVIO_PAGAMENTO,
        pagamento.receiptHandle as string
      );
    } catch (err) {
      console.log(err);
      queueService.enviaParaDLQ(FILA_ENVIO_PAGAMENTO, DLQ_ENVIO_PAGAMENTO, {
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
