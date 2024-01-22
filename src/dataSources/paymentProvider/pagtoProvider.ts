import QRCode from "qrcode";

import {
  MsgPedidoPagamentoBody,
  urlQrcodeQueueBody,
} from "~domain/entities/types/pagamentoType";

import PagtoProviderInterface from "./interfaces/PagtoProviderInterface";

export default class PagtoProvider implements PagtoProviderInterface {
  static geraCobranca: any;
  async geraCobranca(
    pagamento: MsgPedidoPagamentoBody
  ): Promise<urlQrcodeQueueBody> {
    const urlQrCodeFake = (await QRCode.toDataURL(
      // <url>/pagamentos/processamento/:id
      `${process.env.ENDPOINT_PROCESSA_PAGTO}/${pagamento.pedidoId}`
    )) as string;

    return { pedidoId: pagamento.pedidoId, qrUrl: urlQrCodeFake };
  }
}
