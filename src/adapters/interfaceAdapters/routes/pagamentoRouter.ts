import express, { NextFunction } from "express";
import { Request, Response } from "express";

import PagamentoController from "../controllers/pagamentoController";
import MessageBrokerService from "dataSources/messageBroker/messageBrokerService";

// import authenticate from "../middleware/auth";
// import { validaRequisicao } from "./utils";

const queueService = new MessageBrokerService();

const pagamentoRouter = express.Router();

/**
 * @openapi
 * /pagamento:
 *   get:
 *     summary: Consulta pagamento pelo id
 *     tags:
 *       - Pagamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Objeto Pagamento.
 *       500:
 *         description: Erro na api.
 */
pagamentoRouter.get(
  "/pagamentos/:id",
  // authenticate(TipoUsuario.ADMIN),
  // validaRequisicao(RecebimentoDePagamentosSchema),
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {     
      const { id } = req.params;
      const pagamento = await PagamentoController.listaPagamento(id);

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
 *     summary: Recebe confirmação de pagamento via provider
 *     tags:
 *       - Pagamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: string
 *     responses:
 *       204:
 *         description: Mock pagamento efetuado com sucesso.
 *       500:
 *         description: Erro na api.
 */
pagamentoRouter.get(
  "/pagamentos/processamento/:id",
  // authenticate(TipoUsuario.ADMIN),
  // validaRequisicao(RecebimentoDePagamentosSchema),
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await PagamentoController.atualizaStatusPagamento(queueService, id);
      if (response) {
        return res.status(204);
      } else {
        throw new Error("Pagamento não encontrado");
      }
    } catch (err: unknown) {
      console.log(`Erro ao consultar pagamento: ${err}`);
      return next(err);
    }
  }
);

export default pagamentoRouter;
