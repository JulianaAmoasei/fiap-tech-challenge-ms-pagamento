import MetodoPagamentoRepository from "adapters/repositories/database/metodoPagamentoRepository";

import { MetodoPagamentoDTO } from "~domain/entities/types/MetodoPagamentoType";

export default class MetodoPagamentoUseCase {
  static async listaPagamentos(): Promise<MetodoPagamentoDTO[] | null> {
    return MetodoPagamentoRepository.listaMetodosPagamento();
  }
}
