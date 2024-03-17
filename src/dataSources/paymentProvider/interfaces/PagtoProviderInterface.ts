import {
  EstornoGatewayBody,
  MsgCancelamentoPedidoBody,
  MsgPedidoPagamentoBody,
  UrlQrcodeQueueBody,
} from "~domain/entities/types/pagamentoType";

export default interface PagtoProviderInterface {
  geraCobranca(pagamento: MsgPedidoPagamentoBody): Promise<UrlQrcodeQueueBody | Error>;
  estornaCobranca(pagamento: MsgCancelamentoPedidoBody): Promise<EstornoGatewayBody | Error>;
}