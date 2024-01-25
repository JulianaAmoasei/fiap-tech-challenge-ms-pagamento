import QRCode from "qrcode";

import {
  MsgPedidoPagamentoBody,
  urlQrcodeQueueBody,
} from "~domain/entities/types/pagamentoType";

import PagtoProviderInterface from "./interfaces/PagtoProviderInterface";

export default class PagtoProvider implements PagtoProviderInterface {
  async geraCobranca(
    pagamento: MsgPedidoPagamentoBody
  ): Promise<urlQrcodeQueueBody> {
    const urlQrCodeFake = (await QRCode.toDataURL(
      `${process.env.ENDPOINT_PROCESSA_PAGTO}/${pagamento.pedidoId}`
    ));

    return { pedidoId: pagamento.pedidoId, qrUrl: urlQrCodeFake };
  }
}
