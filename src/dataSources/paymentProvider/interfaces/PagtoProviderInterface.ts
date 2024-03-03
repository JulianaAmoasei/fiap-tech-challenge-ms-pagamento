import {
  estornoGatewayBody,
  MsgCancelamentoPedidoBody,
  MsgPedidoPagamentoBody,
  urlQrcodeQueueBody,
} from "~domain/entities/types/pagamentoType";

export default interface PagtoProviderInterface {
  geraCobranca(pagamento: MsgPedidoPagamentoBody): Promise<urlQrcodeQueueBody | Error>;
  estornaCobranca(pagamento: MsgCancelamentoPedidoBody): Promise<estornoGatewayBody | Error>;
}
