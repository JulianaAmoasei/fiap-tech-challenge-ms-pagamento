import { PagamentoInput } from "../types/pagamentoType";

export default class Pagamento {
  public id: string;
  public idPedido: string;
  public valorPedido: number;
  public valorPagamento: number | null;
  public metodoPagamento: string;
  public statusPagamento: string;
  public createdAt: Date;
  public deletedAt: Date | null;
  public updatedAt: Date | null;

  constructor(PagamentoInput: PagamentoInput) {
    this.id = PagamentoInput.id;
    this.idPedido = PagamentoInput.idPedido;
    this.valorPedido = PagamentoInput.valorPedido;
    this.valorPagamento = PagamentoInput.valorPagamento;
    this.metodoPagamento = PagamentoInput.metodoPagamento;
    this.statusPagamento = PagamentoInput.statusPagamento;
    this.createdAt = PagamentoInput.createdAt ?? new Date();
    this.deletedAt = PagamentoInput.deletedAt ?? null;
    this.updatedAt = PagamentoInput.updatedAt ?? null;
  }
}
