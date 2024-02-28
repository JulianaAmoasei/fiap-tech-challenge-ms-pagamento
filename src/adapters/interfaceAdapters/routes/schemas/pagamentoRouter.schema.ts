import { z } from "zod";

import { StatusPagamentoGateway } from "../../../../domain/entities/types/pagamentoType";

export const RecebimentoDePagamentoGatewaySchema = z.object({
  params: z.object({}),
  body: z.object({
    pedidoId: z
      .string({
        required_error: "O id do pedido é obrigatório",
        invalid_type_error: "id inválido",
      })
      .uuid({ message: "O id deve ser UUID" }),
    statusPagamento: z
      .enum([StatusPagamentoGateway.SUCESSO, StatusPagamentoGateway.FALHA])
  }),
});

export type RecebimentoDePagamentoGatewayPayload = z.infer<typeof RecebimentoDePagamentoGatewaySchema>;
export type RecebimentoDePagamentoGatewayBody = RecebimentoDePagamentoGatewayPayload["body"];
export type RecebimentoDePagamentoGatewayParams = RecebimentoDePagamentoGatewayPayload["params"];
