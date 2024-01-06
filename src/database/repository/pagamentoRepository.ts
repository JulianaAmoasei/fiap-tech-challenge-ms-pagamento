import { PagamentoDTO } from "../../entities/types/pagamentoType";
import PagamentoModel from "../models/pagamentoModel";

export default class PagamentoRepository {
  async criaPagamento(pagamento: PagamentoDTO): Promise<PagamentoDTO> {
    return (await PagamentoModel.create(pagamento)) as PagamentoDTO;
  }

  async listaPagamento(idPedido: string): Promise<PagamentoDTO> {
    return PagamentoModel.findOne(idPedido) as PagamentoDTO;
  }

  async listaPagamentos(): Promise<PagamentoDTO[]> {
    return PagamentoModel.findAll();
  }
}
