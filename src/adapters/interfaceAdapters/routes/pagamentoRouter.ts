/* eslint-disable @typescript-eslint/no-explicit-any */
import MessageBrokerService from "dataSources/messageBroker/messageBrokerService";
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

import {
  ProcessPagamentoReturnBody,
  StatusPagamentoGateway,
} from "../../../domain/entities/types/pagamentoType";
import PagamentoController from "../controllers/pagamentoController";

import { RecebimentoDePagamentoGatewayPayload } from "./schemas/pagamentoRouter.schema";

const queueService = new MessageBrokerService();

const pagamentoRouter = express.Router();

/**
 * @openapi
 * /api/pagamento/{pedidoId}:
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
pagamentoRouter.get("/api/pagamento/:pedidoId", (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
}) as RequestHandler);

/**
 * @openapi
 * /api/pagamento/processamento/{pedidoId}:
 *   post:
 *     summary: Recebe dados do pagamento via provider (pagto efetuado ou falha)
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
 *               statusPagamento:
 *                 type: string
 *                 enum: [Pagamento efetuado com sucesso, Falha no pagamento]
 *             required:
 *               - pedidoId
 *               - statusPagamento
 *     responses:
 *       200:
 *         description: Retorna confirmação do pagamento processado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: success
 *               required:
 *                 - body
 *             status: success
 *       500:
 *         description: Erro na api.
 */
pagamentoRouter.post("/api/pagamento/processamento/", (async (
  req: Request<unknown, RecebimentoDePagamentoGatewayPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pedidoId, statusPagamento } = req.body;

    await PagamentoController.atualizaStatusPagamento(queueService, {
      pedidoId,
      statusPagamento,
    });

    const mensagem =
      statusPagamento === StatusPagamentoGateway.SUCESSO
        ? ProcessPagamentoReturnBody.SUCESSO
        : ProcessPagamentoReturnBody.FALHA;

    return res.status(200).json({ mensagem });
  } catch (err: any) {
    //TODO: substituir mensagem hardcoded (já está no enum)
    if (err.message === "o pagamento já foi processado") {
      return res
        .status(200)
        .json({ mensagem: ProcessPagamentoReturnBody.ERRO_JA_PROCESSADO });
    }
    console.error(`Erro ao processar pagamento: ${err}`);
    return next(err);
  }
}) as RequestHandler);

export default pagamentoRouter;
