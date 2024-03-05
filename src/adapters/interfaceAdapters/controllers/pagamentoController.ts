import QueueRepository from "adapters/repositories/messageBroker/messageBrokerRepository";
import PagtoProviderInterface from "dataSources/paymentProvider/interfaces/PagtoProviderInterface";

import PagamentoUseCase from "~domain/useCases/pagamentoUseCase";

import {
  MsgCancelamentoPedidoBody,
  MsgPedidoPagamentoBody,
  PagamentoDTO,
  StatusPagamentoGateway,
  StatusPagamentoServico,
} from "../../../domain/entities/types/pagamentoType";
import PagamentoRepository from "../../repositories/database/pagamentoRepository";
import { RecebimentoDePagamentoGatewayBody } from "../routes/schemas/pagamentoRouter.schema";

export default class PagamentoController {
  static async recebePagamento(
    queueRepository: QueueRepository,
    pagtoProvider: PagtoProviderInterface,
    pagamento: MsgPedidoPagamentoBody
  ) {
    await PagamentoUseCase.enviaCobranca(
      queueRepository,
      pagtoProvider,
      pagamento
    );
    return PagamentoRepository.criaPagamento(pagamento);
  }

  static async estornaPagamento(
    queueRepository: QueueRepository,
    pagtoProvider: PagtoProviderInterface,
    pagamento: MsgCancelamentoPedidoBody
  ) {
    const dadosEstornoPagamento = await PagamentoUseCase.estornaCobrancaPagamento(
      queueRepository,
      pagtoProvider,
      pagamento
    );
    const dadosPagto: PagamentoDTO = await PagamentoRepository.listaPagamento(
      pagamento.pedidoId
    );
    const stringObj = JSON.stringify(dadosPagto);

    return PagamentoRepository.atualizaPagamento(
      dadosPagto._id as string,
      {
        ...JSON.parse(stringObj),
        statusPagamento: StatusPagamentoServico.PAGAMENTO_ESTORNADO,
        estornoId: dadosEstornoPagamento.estornoId,
      }
    );
  }

  static async listaPagamento(id: string) {
    return PagamentoRepository.listaPagamento(id);
  }
  static async atualizaStatusPagamento(
    queueService: QueueRepository,
    resultPagamentoResponse: RecebimentoDePagamentoGatewayBody
  ) {
    const dadosPagto: PagamentoDTO = await PagamentoRepository.listaPagamento(
      resultPagamentoResponse.pedidoId
    );

    if (
      dadosPagto.statusPagamento !== StatusPagamentoServico.AGUARDANDO_PAGAMENTO
    ) {
      throw Error("o pagamento já foi processado");
    }

    const stringObj = JSON.stringify(dadosPagto);

    const statusPagamento =
      resultPagamentoResponse.statusPagamento === StatusPagamentoGateway.SUCESSO
        ? StatusPagamentoServico.PAGAMENTO_CONCLUIDO
        : StatusPagamentoServico.FALHA;

    const pagtoAtualizado = await PagamentoRepository.atualizaPagamento(
      dadosPagto._id as string,
      {
        ...JSON.parse(stringObj),
        statusPagamento,
      }
    );
    await PagamentoUseCase.enviaDadosPagtoAtualizados(
      queueService,
      pagtoAtualizado as PagamentoDTO
    );
    return pagtoAtualizado;
  }
}
