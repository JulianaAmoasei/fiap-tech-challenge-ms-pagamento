export interface MetodoPagamentoDTO {
  _id?: string;
  nome: string;
  ativo: boolean;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export interface MetodoPagamentoInput {
  _id?: string;
  nome: string;
  ativo?: boolean;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export interface MetodoPagamentoPadraoDTO {
  id: string;
}