import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

import PagamentoError from "~domain/entities/errors/PagamentoErrors";
import {
  estornoGatewayBody,
  MsgPedidoPagamentoBody,
  PagamentoErrorCodes,
  urlQrcodeQueueBody,
} from "~domain/entities/types/pagamentoType";

import PagtoProviderInterface from "./interfaces/PagtoProviderInterface";

export default class PagtoProvider implements PagtoProviderInterface {
  async geraCobranca(
    pagamento: MsgPedidoPagamentoBody
  ): Promise<urlQrcodeQueueBody> {
    try {
      const urlQrCodeFake = await QRCode.toDataURL(
        `${process.env.ENDPOINT_PROCESSA_PAGTO}/${pagamento.pedidoId}`
      );
      return {
        pedidoId: pagamento.pedidoId,
        qrUrl: urlQrCodeFake,
      } as urlQrcodeQueueBody;
    } catch (error) {
      const errorCode: PagamentoErrorCodes =
        PagamentoErrorCodes.FALHA_CONEXAO_PROVIDER;
      throw new PagamentoError(errorCode);
    }
  }

  async estornaCobranca(
    pagamento: MsgPedidoPagamentoBody
  ): Promise<estornoGatewayBody> {
    // mock do estorno feito pelo provider
    return {
      pedidoId: pagamento.pedidoId,
      estornoId: uuidv4(),
    } as estornoGatewayBody;
  }
}
