import MetodoPagamentoRepository from "adapters/repositories/database/metodoPagamentoRepository";

export default class MetodoPagamentoController {
  static async listaMetodosPagamento() {
    return MetodoPagamentoRepository.listaMetodosPagamento();
  }
  static async retornaMetodoPagamentoPadraoId() {
    return MetodoPagamentoRepository.getMetodoPagamentoPadraoId();
  }
}
