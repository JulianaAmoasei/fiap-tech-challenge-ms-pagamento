
import QueueRepository from "adapters/repositories/messageBroker/messageBrokerRepository";
import PagtoProviderInterface from "dataSources/paymentProvider/interfaces/PagtoProviderInterface";

import PagamentoUseCase from "~domain/useCases/pagamentoUseCase";

import {
  MsgPedidoPagamentoBody,
  PagamentoDTO,
  statusPagamento,
} from "../../../domain/entities/types/pagamentoType";
import PagamentoRepository from "../../repositories/database/pagamentoRepository";

export default class PagamentoController {
  static async recebePagamento(queueRepository: QueueRepository, pagtoProvider: PagtoProviderInterface, pagamento: MsgPedidoPagamentoBody) {
    await PagamentoUseCase.enviaCobranca(queueRepository, pagtoProvider,  pagamento);
    return PagamentoRepository.criaPagamento(pagamento);
  }

  static async listaPagamento(id: string) {
    return PagamentoRepository.listaPagamento(id);
  }
  static async atualizaStatusPagamento(queueService: QueueRepository, pedidoId: string) {
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

    await PagamentoUseCase.enviaDadosPagtoAtualizados(queueService,
      pagtoAtualizado as PagamentoDTO
    );
    return pagtoAtualizado;
  }
}
