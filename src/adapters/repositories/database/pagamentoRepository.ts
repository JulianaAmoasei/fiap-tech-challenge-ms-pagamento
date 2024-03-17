import { ObjectId } from "mongodb";

import PagamentoModel from "../../../dataSources/database/models/pagamentoModel";
import {
  MsgPedidoPagamentoBody,
  PagamentoDTO,
  StatusPagamentoServico,
} from "../../../domain/entities/types/pagamentoType";

export const pagamentoModel = PagamentoModel.init();

export default class PagamentoRepository {
  static async criaPagamento(pagamento: MsgPedidoPagamentoBody) {
    const dataObj: PagamentoDTO = {
      _id: String(new ObjectId()),
      ...pagamento,
      statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    };
    return pagamentoModel.pagamento.create(dataObj);
  }

  static async listaPagamento(pedidoId: string): Promise<PagamentoDTO | null> {
    return pagamentoModel.pagamento.findOne({
      pedidoId,
    }) as unknown as PagamentoDTO;
  }

  static async atualizaPagamento(
    id: string,
    pagamento: PagamentoDTO
  ): Promise<PagamentoDTO | null> {
    return pagamentoModel.pagamento.findByIdAndUpdate(id, pagamento, {
      new: true
    });
  }
}
