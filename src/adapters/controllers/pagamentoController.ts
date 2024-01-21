import { PagamentoInput } from "../../domain/entities/types/pagamentoType";
import PagamentoRepository from "../database/repository/pagamentoRepository";

export default class PagamentoController {
  static async recebePagamento(pagamento: PagamentoInput) {
    return PagamentoRepository.criaPagamento(pagamento);
  }

  static async listaPagamento(id: string) {
    return PagamentoRepository.listaPagamento(id);
  }
}
