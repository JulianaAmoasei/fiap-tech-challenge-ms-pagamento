export interface PagamentoDTO {
  id: string;
  idPedido: string;
  valorPedido: number;
  valorPagamento: number | null;
  metodoPagamento: string;
  statusPagamento: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export interface PagamentoInput {
  id: string;
  idPedido: string;
  valorPedido: number;
  valorPagamento: number | null;
  metodoPagamento: string;
  statusPagamento: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}
