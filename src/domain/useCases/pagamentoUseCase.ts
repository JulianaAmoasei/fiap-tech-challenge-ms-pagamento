import PagamentoRepository from "adapters/repositories/database/pagamentoRepository";
import QueueRepository from "adapters/repositories/messageBroker/messageBrokerRepository";
import PagtoProviderInterface from "dataSources/paymentProvider/interfaces/PagtoProviderInterface";

import PagamentoError from "~domain/entities/errors/PagamentoErrors";
import {
  MsgPagtoAtualizadoBody,
  MsgPedidoPagamentoBody,
  PagamentoDTO,
  StatusPagamentoServico,
  urlQrcodeQueueBody,
} from "~domain/entities/types/pagamentoType";

export default class PagamentoUseCase {
  static async enviaCobranca(
    queueRepository: QueueRepository,
    pagtoProvider: PagtoProviderInterface,
    pagamento: MsgPedidoPagamentoBody
  ): Promise<void> {
    try {
      const dadosCobranca = await pagtoProvider.geraCobranca(pagamento);
      if (dadosCobranca instanceof Error) {
        throw dadosCobranca;
      }  
      queueRepository.enviaParaFila<urlQrcodeQueueBody | Error>(
        dadosCobranca,
        process.env.URL_FILA_ENVIO_COBRANCA as string
      );
    } catch (error) {
      if (error instanceof PagamentoError) {
        await this.cancelaCobranca(pagamento, queueRepository);
        throw error;
      }
    }
  }

  static async enviaDadosPagtoAtualizados(
    queueRepository: QueueRepository,
    dadosPagamento: PagamentoDTO
  ) {
    const body: MsgPagtoAtualizadoBody = {
      pedidoId: dadosPagamento.pedidoId,
      statusPagamento: dadosPagamento.statusPagamento,
    };
    queueRepository.enviaParaFila<MsgPagtoAtualizadoBody>(
      body,
      process.env.URL_FILA_PEDIDO_PAGO as string
    );
  }

  static async cancelaCobranca(pagamento: MsgPedidoPagamentoBody, queueRepository: QueueRepository) {
    const dadosPagamento = await PagamentoRepository.listaPagamento(
      pagamento.pedidoId
    );
    //parse necessário para acessar o _doc do mongo
    const stringObj = JSON.stringify(dadosPagamento);
    const pagtoAtualizado = await PagamentoRepository.atualizaPagamento(
      dadosPagamento._id as string,
      {
        ...JSON.parse(stringObj),
        statusPagamento: StatusPagamentoServico.FALHA,
      }
    );
    await PagamentoUseCase.enviaDadosPagtoAtualizados(
      queueRepository,
      pagtoAtualizado as PagamentoDTO
    );
  }
}
