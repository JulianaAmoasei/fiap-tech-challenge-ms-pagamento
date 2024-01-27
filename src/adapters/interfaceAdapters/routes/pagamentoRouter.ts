/* eslint-disable @typescript-eslint/no-explicit-any */
import MessageBrokerService from "dataSources/messageBroker/messageBrokerService";
import express, { NextFunction, Request, RequestHandler, Response } from "express";

import PagamentoController from "../controllers/pagamentoController";

const queueService = new MessageBrokerService();

const pagamentoRouter = express.Router();

/**
 * @openapi
 * /pagamentos/{pedidoId}:
 *   get:
 *     summary: Consulta pagamento do pedido
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id do pedido
 *     tags:
 *       - Pagamento
 *     responses:
 *       200:
 *         description: Objeto Pagamento.
 *       500:
 *         description: Erro na api.
 */
pagamentoRouter.get(
  "/api/pagamentos/:pedidoId",
  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pedidoId } = req.params;
      const pagamento = await PagamentoController.listaPagamento(pedidoId);
      if (!pagamento) {
        console.error("Pagamento não encontrado!");

        return res.status(404).json({
          status: "error",
          pagamento,
        });
      }

      return res.status(200).json({
        status: "success",
        pagamento,
      });
    } catch (err: unknown) {
      console.error(`Erro ao consultar pagamento: ${err}`);
      return next(err);
    }
  }) as RequestHandler
);

/**
 * @openapi
 * /pagamentos/processamento/{pedidoId}:
 *   get:
 *     summary: Recebe confirmação de pagamento via provider
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id do pedido
 *     tags:
 *       - Pagamento
 *     responses:
 *       204:
 *         description: Mock pagamento efetuado com sucesso.
 *       500:
 *         description: Erro na api.
 */
pagamentoRouter.get(
  "/api/pagamentos/processamento/:pedidoId",
  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pedidoId } = req.params;
      await PagamentoController.atualizaStatusPagamento(queueService, pedidoId);

      return res.status(200).json({ 'mensagem': 'Processamento realizado' });
    } catch (err: any) {
      if (err.message === 'pagamento_ja_processado') {
        return res.status(200).json({ 'mensagem': 'Processamento já foi realizado' })
      }
      console.error(`Erro ao processar pagamento: ${err}`);
      return next(err);
    }
  }) as RequestHandler
);

export default pagamentoRouter;
