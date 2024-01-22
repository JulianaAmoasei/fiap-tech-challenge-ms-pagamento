import MessageBrokerService from 'dataSources/messageBroker/messageBrokerService';
import PagtoProvider from 'dataSources/paymentProvider/pagtoProvider';

import { MsgPagtoAtualizadoBody, MsgPedidoPagamentoBody, PagamentoDTO, statusPagamento, urlQrcodeQueueBody } from '~domain/entities/types/pagamentoType';

const queueService = new MessageBrokerService();

export default class PagamentoUseCase {
  static async enviaCobranca(pagamento: MsgPedidoPagamentoBody) {
    const dadosCobranca = await PagtoProvider.geraCobranca(pagamento);
    // criar mensagem com dadosCobranca
    queueService.enviaParaFila<urlQrcodeQueueBody>(dadosCobranca, process.env.FILA_ENVIO_COBRANCA as string);
  }

  static async enviaDadosPagtoAtualizados(dadosPagamento: PagamentoDTO) {
    const body: MsgPagtoAtualizadoBody = {
      pedidoId: dadosPagamento.pedidoId,
      statusPagamento: statusPagamento.PAGAMENTO_CONCLUIDO
    }
    queueService.enviaParaFila<MsgPagtoAtualizadoBody>(body, process.env.FILA_ENVIO_COBRANCA as string);
  }
}
