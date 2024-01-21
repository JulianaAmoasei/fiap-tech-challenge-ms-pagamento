import PagtoProvider from 'dataSources/paymentProvider/pagtoProvider';

import { SendPaymentQueueBody } from '~domain/entities/types/pagamentoType';

export default class PagamentoUseCase {
  static async enviaCobranca(pagamento: SendPaymentQueueBody, pagtoProvider: PagtoProvider) {
    const dadosCobranca = await pagtoProvider.geraCobranca(pagamento);
    // criar mensagem com dadosCobranca
  }
}
