import { PagamentoDTO } from "../../../domain/types/pagamentoType";
import PagamentoModel from "../../api/models/pagamentoModel";

const pagamentoModel = PagamentoModel.init();

export default class PagamentoRepository {

  static async criaPagamento(pagamento: PagamentoDTO) {  
    return pagamentoModel.pagamento.create(pagamento);
  }

  static async atualizaPagamento(id: string, pagamento: PagamentoDTO): Promise<PagamentoDTO | null> {  
    return pagamentoModel.pagamento.findByIdAndUpdate(id, pagamento);
  }

  static async listaPagamento(idPedido: string): Promise<PagamentoDTO> {
    return pagamentoModel.pagamento.findOne({ idPedido }) as unknown as PagamentoDTO;
  }

  static async listaPagamentos(): Promise<PagamentoDTO[]> {
    return pagamentoModel.pagamento.find({}) as unknown as PagamentoDTO[];
  }
}
