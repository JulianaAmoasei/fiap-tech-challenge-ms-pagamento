import { z } from "zod";

export const RecebimentoDePagamentoGatewaySchema = z.object({
  params: z.object({}),
  body: z.object({
    pedidoId: z
      .string({
        required_error: "O id do pedido é obrigatório",
        invalid_type_error: "id inválido",
      })
      .uuid({ message: "O id deve ser UUID" }),
    pagamentoEfetuado: z
      .boolean()
  }),
});

export type RecebimentoDePagamentoGatewayPayload = z.infer<typeof RecebimentoDePagamentoGatewaySchema>;
export type RecebimentoDePagamentoGatewayBody = RecebimentoDePagamentoGatewayPayload["body"];
export type RecebimentoDePagamentoGatewayParams = RecebimentoDePagamentoGatewayPayload["params"];
