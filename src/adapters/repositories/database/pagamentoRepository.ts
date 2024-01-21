import PagamentoModel from "../../../dataSources/database/models/pagamentoModel";
import {
  PagamentoDTO,
  SendPaymentQueueBody,
  statusPagamento,
} from "../../../domain/entities/types/pagamentoType";

export const pagamentoModel = PagamentoModel.init();

export default class PagamentoRepository {
  static async criaPagamento(pagamento: SendPaymentQueueBody) {
    const dataObj: PagamentoDTO = {
      ...pagamento,
      statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    };
    return pagamentoModel.pagamento.create(dataObj);
  }

  static async listaPagamento(idPedido: string): Promise<PagamentoDTO> {
    return pagamentoModel.pagamento.findOne({
      idPedido,
    }) as unknown as PagamentoDTO;
  }

  static async atualizaPagamento(
    id: string,
    pagamento: PagamentoDTO
  ): Promise<PagamentoDTO | null> {
    return pagamentoModel.pagamento.findByIdAndUpdate(id, pagamento);
  }
}
