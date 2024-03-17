import PagamentoRepository from "adapters/repositories/database/pagamentoRepository";
import QueueRepository from "adapters/repositories/messageBroker/messageBrokerRepository";
import PagtoProviderInterface from "dataSources/paymentProvider/interfaces/PagtoProviderInterface";

import PagamentoError from "~domain/entities/errors/PagamentoErrors";
import {
  EstornoGatewayBody,
  MsgCancelamentoPedidoBody,
  MsgPagtoAtualizadoBody,
  MsgPedidoPagamentoBody,
  PagamentoDTO,
  StatusPagamentoServico,
  UrlQrcodeQueueBody,
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
        console.log('================================================');
        console.log(dadosCobranca);
        
        throw dadosCobranca;
      }  
      queueRepository.enviaParaFila<UrlQrcodeQueueBody | Error>(
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

  static async estornaCobrancaPagamento(
    queueRepository: QueueRepository,
    pagtoProvider: PagtoProviderInterface,
    pagamento: MsgCancelamentoPedidoBody
  ): Promise<EstornoGatewayBody> {
    try {
      const dadosCobranca = await pagtoProvider.estornaCobranca(pagamento);
      if (dadosCobranca instanceof Error) {
        throw dadosCobranca;
      }
      queueRepository.enviaParaFila<EstornoGatewayBody | Error>(
        {...dadosCobranca, statusPagamento: StatusPagamentoServico.PAGAMENTO_ESTORNADO},
        process.env.URL_FILA_ATUALIZA_PEDIDO as string
      );
      return dadosCobranca;
    } catch (error) {
      if (error instanceof PagamentoError) {
        await this.cancelaCobranca(pagamento, queueRepository);
        throw error;
      }
      throw Error('erro não esperado')
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
      process.env.URL_FILA_ATUALIZA_PEDIDO as string
    );
  }

  static async cancelaCobranca<T extends { pedidoId: string }>(pagamento: T, queueRepository: QueueRepository): Promise<void>{
    const dadosPagamento = await PagamentoRepository.listaPagamento(
      pagamento.pedidoId
    );
    //parse necessário para acessar o _doc do mongo
    const stringObj = JSON.stringify(dadosPagamento);
    const pagtoAtualizado = await PagamentoRepository.atualizaPagamento(
      dadosPagamento?._id as string,
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
