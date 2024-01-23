import MessageBrokerService from 'dataSources/messageBroker/messageBrokerService';
import PagtoProvider from 'dataSources/paymentProvider/pagtoProvider';

import { MsgPagtoAtualizadoBody, MsgPedidoPagamentoBody, PagamentoDTO, urlQrcodeQueueBody } from '~domain/entities/types/pagamentoType';

const queueService = new MessageBrokerService();

export default class PagamentoUseCase {
  static async enviaCobranca(pagamento: MsgPedidoPagamentoBody) {
    const dadosCobranca = await PagtoProvider.geraCobranca(pagamento);
    // criar mensagem com dadosCobranca
    queueService.enviaParaFila<urlQrcodeQueueBody>(dadosCobranca, process.env.URL_FILA_ENVIO_COBRANCA as string);
  }

  static async enviaDadosPagtoAtualizados(dadosPagamento: PagamentoDTO) {
    const body: MsgPagtoAtualizadoBody = {
      pedidoId: dadosPagamento.pedidoId,
      statusPagamento: dadosPagamento.statusPagamento
    }
    queueService.enviaParaFila<MsgPagtoAtualizadoBody>(body, process.env.URL_FILA_ATUALIZACAO_STATUS_PAGTO as string);
  }
}
