import QRCode from "qrcode";

import PagamentoError from "~domain/entities/errors/PagamentoErrors";
import {
  MsgPedidoPagamentoBody,
  PagamentoErrorCodes,
  urlQrcodeQueueBody,
} from "~domain/entities/types/pagamentoType";

import PagtoProviderInterface from "./interfaces/PagtoProviderInterface";

export default class PagtoProvider implements PagtoProviderInterface {
  async geraCobranca(
    pagamento: MsgPedidoPagamentoBody
  ): Promise<urlQrcodeQueueBody | Error> {
    try {
      const urlQrCodeFake = (await QRCode.toDataURL(
        `${process.env.ENDPOINT_PROCESSA_PAGTO}/${pagamento.pedidoId}`
      ));
      return { pedidoId: pagamento.pedidoId, qrUrl: urlQrCodeFake };
    } catch (error) {
      const errorCode: PagamentoErrorCodes = PagamentoErrorCodes.FALHA_CONEXAO_PROVIDER;
      throw new PagamentoError(errorCode);
    }
  }
}
