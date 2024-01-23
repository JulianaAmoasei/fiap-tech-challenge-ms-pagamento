import PagamentoUseCase from "~domain/useCases/pagamentoUseCase";

import {
  MsgPedidoPagamentoBody,
  PagamentoDTO,
  statusPagamento,
} from "../../../domain/entities/types/pagamentoType";
import PagamentoRepository from "../../repositories/database/pagamentoRepository";

export default class PagamentoController {
  static async recebePagamento(pagamento: MsgPedidoPagamentoBody) {
    await PagamentoUseCase.enviaCobranca(pagamento);
    return PagamentoRepository.criaPagamento(pagamento);
  }

  static async listaPagamento(id: string) {
    return PagamentoRepository.listaPagamento(id);
  }

  static async atualizaStatusPagamento(pedidoId: string) {
    const dadosPagto: PagamentoDTO = await PagamentoRepository.listaPagamento(
      pedidoId
    );
    //parse necessário para acessar o _doc do mongo
    const stringObj = JSON.stringify(dadosPagto);
    const pagtoAtualizado = await PagamentoRepository.atualizaPagamento(
      dadosPagto._id?.toString() as string,
      {
        ...JSON.parse(stringObj),
        statusPagamento: statusPagamento.PAGAMENTO_CONCLUIDO,
      }
    );

    await PagamentoUseCase.enviaDadosPagtoAtualizados(
      pagtoAtualizado as PagamentoDTO
    );
    return pagtoAtualizado;
  }
}
