import { PagamentoInput } from "./types/pagamentoType";

export default class Pagamento {
  public _id?: string;
  public pedidoId: string;
  public valor: number;
  public metodoDePagamento: string;
  public statusPagamento: string;
  public createdAt: Date;
  public deletedAt: Date | null;
  public updatedAt: Date | null;

  constructor(PagamentoInput: PagamentoInput) {
    this._id = PagamentoInput._id;
    this.pedidoId = PagamentoInput.pedidoId;
    this.valor = PagamentoInput.valor;
    this.metodoDePagamento = PagamentoInput.metodoDePagamento;
    this.statusPagamento = PagamentoInput.statusPagamento;
    this.createdAt = PagamentoInput.createdAt ?? new Date();
    this.deletedAt = PagamentoInput.deletedAt ?? null;
    this.updatedAt = PagamentoInput.updatedAt ?? null;
  }
}
