
import PagtoProvider from "dataSources/paymentProvider/pagtoProvider";

import PagamentoUseCase from "~domain/useCases/pagamentoUseCase";

import {
  PagamentoDTO,
  SendPaymentQueueBody,
  statusPagamento,
} from "../../../domain/entities/types/pagamentoType";
import PagamentoRepository from "../../repositories/database/pagamentoRepository";

export default class PagamentoController {
  static async recebePagamento(pagamento: SendPaymentQueueBody, pagtoProvider: PagtoProvider) {
    await PagamentoUseCase.enviaCobranca(pagamento, pagtoProvider);
    return PagamentoRepository.criaPagamento(pagamento);
  }

  static async listaPagamento(id: string) {
    return PagamentoRepository.listaPagamento(id);
  }

  static async atualizaStatusPagamento(idPedido: string) {
    const dadosPagto: PagamentoDTO = await PagamentoRepository.listaPagamento(
      idPedido
    );
    return PagamentoRepository.atualizaPagamento(dadosPagto.id as string, {
      ...dadosPagto,
      statusPagamento: statusPagamento.PAGAMENTO_CONCLUIDO,
    });
  }
}
 