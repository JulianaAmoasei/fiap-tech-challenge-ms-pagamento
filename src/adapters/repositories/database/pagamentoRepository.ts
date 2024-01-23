import PagamentoModel from "../../../dataSources/database/models/pagamentoModel";
import {
  MsgPedidoPagamentoBody,
  PagamentoDTO,
  statusPagamento,
} from "../../../domain/entities/types/pagamentoType";

export const pagamentoModel = PagamentoModel.init();

export default class PagamentoRepository {
  static async criaPagamento(pagamento: MsgPedidoPagamentoBody) {
    const dataObj: PagamentoDTO = {
      ...pagamento,
      statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    };
    return pagamentoModel.pagamento.create(dataObj);
  }

  static async listaPagamento(pedidoId: string): Promise<PagamentoDTO> {
    return pagamentoModel.pagamento.findOne({
      pedidoId,
    }) as unknown as PagamentoDTO;
  }

  static async atualizaPagamento(
    id: string,
    pagamento: PagamentoDTO
  ): Promise<PagamentoDTO | null> {
    return pagamentoModel.pagamento.findByIdAndUpdate(id, pagamento);
  }
}
