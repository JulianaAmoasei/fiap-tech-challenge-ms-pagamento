import QueueRepository from 'adapters/repositories/messageBroker/messageBrokerRepository';
import PagtoProviderInterface from 'dataSources/paymentProvider/interfaces/PagtoProviderInterface';

import { MsgPagtoAtualizadoBody, MsgPedidoPagamentoBody, PagamentoDTO, urlQrcodeQueueBody } from '~domain/entities/types/pagamentoType';

export default class PagamentoUseCase {
  static async enviaCobranca(queueRepository: QueueRepository, pagtoProvider: PagtoProviderInterface, pagamento: MsgPedidoPagamentoBody) {
    const dadosCobranca = await pagtoProvider.geraCobranca(pagamento);
    queueRepository.enviaParaFila<urlQrcodeQueueBody>(dadosCobranca, process.env.URL_FILA_ENVIO_COBRANCA as string);
  }

  static async enviaDadosPagtoAtualizados(queueRepository: QueueRepository, dadosPagamento: PagamentoDTO) {
    const body: MsgPagtoAtualizadoBody = {
      pedidoId: dadosPagamento.pedidoId,
      statusPagamento: dadosPagamento.statusPagamento
    }
    queueRepository.enviaParaFila<MsgPagtoAtualizadoBody>(body, process.env.URL_FILA_PEDIDO_PAGO as string);
  }
}
