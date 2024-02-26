import {
  MsgPedidoPagamentoBody,
  urlQrcodeQueueBody,
} from "~domain/entities/types/pagamentoType";

export default interface PagtoProviderInterface {
  geraCobranca(pagamento: MsgPedidoPagamentoBody): Promise<urlQrcodeQueueBody | Error>;
}
