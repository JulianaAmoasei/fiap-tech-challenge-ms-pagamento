import express, { NextFunction } from "express";
import { Request, Response } from "express";

import PagamentoController from "../controllers/pagamentoController";

// import authenticate from "../middleware/auth";
// import { validaRequisicao } from "./utils";

const pagamentoRouter = express.Router();

/**
 * @openapi
 * /pagamento:
 *   get:
 *     summary: Consulta pagamento pelo id
 *     tags:
 *       - Pagamento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPedido:
 *                 type: string
 *     responses:
 *       200:
 *         description: Objeto Pagamento.
 *       500:
 *         description: Erro na api.
 */
pagamentoRouter.get(
  "/:id",
  // authenticate(TipoUsuario.ADMIN),
  // validaRequisicao(RecebimentoDePagamentosSchema),
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { idPedido } = req.params;
      const pagamento = await PagamentoController.listaPagamento(idPedido);

      // TODO: separar util de obj resposta
      if (pagamento) {
        return res.status(200).json({
          status: "success",
          pagamento,
        });
      } else {
        throw new Error("Pagamento não encontrado!");
      }
    } catch (err: unknown) {
      console.log(`Erro ao consultar pagamento: ${err}`);
      return next(err);
    }
  }
);

/**
 * @openapi
 * /pagamento:
 *   get:
 *     summary: Consulta lista de pagamentos
 *     tags:
 *       - Pagamento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Lista de objetos Pagamento.
 *       500:
 *         description: Erro na api.
 */
pagamentoRouter.get(
  "/",
  // authenticate(TipoUsuario.ADMIN),
  // validaRequisicao(RecebimentoDePagamentosSchema),
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const listaPagamentos = await PagamentoController.listaPagamentos();

      // TODO: separar util de obj resposta
      if (listaPagamentos) {
        return res.status(200).json({
          status: "success",
          listaPagamentos,
        });
      } else {
        throw new Error("Lista de pagamentos não encontrada!");
      }
    } catch (err: unknown) {
      console.log(`Erro ao consultar lista de pagamentos: ${err}`);
      return next(err);
    }
  }
);

export default pagamentoRouter;
