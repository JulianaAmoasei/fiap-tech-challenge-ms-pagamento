import QRCode from 'qrcode';

import { SendPaymentQueueBody, urlQrcodeQueueBody } from "~domain/entities/types/pagamentoType";

import PagtoProviderInterface from './interfaces/PagtoProviderInterface';

export default class PagtoProvider implements PagtoProviderInterface {
  async geraCobranca(
    pagamento: SendPaymentQueueBody
  ): Promise<urlQrcodeQueueBody> {
    const urlQrCodeFake = (await QRCode.toDataURL(
      `${process.env.ENDPOINT_PROCESSA_PAGTO}/${pagamento.pedidoId}`
    )) as string;

    return { pedidoId: pagamento.pedidoId, qrUrl: urlQrCodeFake};
  }
}
