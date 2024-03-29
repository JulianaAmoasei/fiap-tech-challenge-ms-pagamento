import { MetodoPagamentoInput } from "./types/MetodoPagamentoType";

export default class MetodoDePagamento {
  public _id?: string;
  public nome: string;
  public ativo: boolean;
  public createdAt: Date;
  public deletedAt: Date | null;
  public updatedAt: Date | null;

  constructor(metodoPagamentoInput: MetodoPagamentoInput) {
    this._id = metodoPagamentoInput._id;
    this.nome = metodoPagamentoInput.nome;
    this.ativo = metodoPagamentoInput.ativo ?? false;
    this.createdAt = metodoPagamentoInput.createdAt ?? new Date();
    this.deletedAt = metodoPagamentoInput.deletedAt ?? null;
    this.updatedAt = metodoPagamentoInput.updatedAt ?? null;
  }

}