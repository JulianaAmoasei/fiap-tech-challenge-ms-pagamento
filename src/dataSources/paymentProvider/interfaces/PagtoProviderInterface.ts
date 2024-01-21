import {
  SendPaymentQueueBody,
  urlQrcodeQueueBody,
} from "~domain/entities/types/pagamentoType";

export default interface PagtoProviderInterface {
  geraCobranca(pagamento: SendPaymentQueueBody): Promise<urlQrcodeQueueBody>;
}
