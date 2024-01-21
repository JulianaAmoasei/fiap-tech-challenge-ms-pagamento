export interface PagamentoDTO {
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
  idPedido: string;
  valorPedido: number;
  valorPagamento: number | null;
  metodoPagamento: string;
  statusPagamento: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export const statusPagamento = {
  AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
  FALHA: "Falha no processo de pagamento",
  PAGAMENTO_CONCLUIDO: "Pagamento concluído",
} as const;

export type StatusPagamento =
  (typeof statusPagamento)[keyof typeof statusPagamento];
