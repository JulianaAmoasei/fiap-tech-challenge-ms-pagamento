export interface PagamentoDTO {
  id?: string;
  pedidoId: string;
  valor: number;
  metodoDePagamento: string;
  statusPagamento: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export interface PagamentoInput {
  id?: string;
  pedidoId: string;
  valor: number;
  metodoDePagamento: string;
  statusPagamento: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export interface SendPaymentQueueBody {
  pedidoId: string;
  metodoDePagamento: string;
  valor: number;
}

export interface urlQrcodeQueueBody {
  pedidoId: string;
  qrUrl: string;
}

export const statusPagamento = {
  AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
  FALHA: "Falha no processo de pagamento",
  PAGAMENTO_CONCLUIDO: "Pagamento concluído",
} as const;

export type StatusPagamento =
  (typeof statusPagamento)[keyof typeof statusPagamento];
