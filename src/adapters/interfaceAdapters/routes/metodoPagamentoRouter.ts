/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, RequestHandler,Response } from "express";

import MetodoPagamentoController from "../controllers/metodoPagamentoController";

// import authenticate from "../middleware/auth";
// import { validaRequisicao } from "./utils";

const metodoPagamentoRouter = express.Router();

/**
 * @openapi
 * /metodo-pagamento:
 *   get:
 *     summary: Consulta métodos de pagamento disponíveis
 *     tags:
 *       - MetodoPagamento
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Array de objetos MetodoPagamento.
 *       500:
 *         description: Erro na api.
 */
metodoPagamentoRouter.get(
  "/api/metodo-pagamento",
  (async (req: Request, res: Response, next: NextFunction): Promise<void | object> => {
    try {
      const message = await MetodoPagamentoController.listaMetodosPagamento(); 
      if (message?.length == 0) {
        console.log("Métodos de pagamento não encontrados!");
        return res.status(404).json({status: "error", message})
      }
      return res.status(200).json({
        status: "success",
        message,
      });
    } catch (err: unknown) {
      console.error(`Erro ao consultar lista de pagamentos: ${err}`);
      return next(err);
    }
  }) as RequestHandler
);

metodoPagamentoRouter.get(
  "/api/metodo-pagamento/default",
  (async (req: Request, res: Response, next: NextFunction): Promise<void | object> => {
    try {
      const message = await MetodoPagamentoController.retornaMetodoPagamentoPadraoId();
      if (!message) {
        console.error("ID método padrão não encontrado!");
        return res.status(404).json({status: "error", message})
      }
      return res.status(200).json({
        status: "success",
        message,
      });
    } catch (err: unknown) {
      console.error(`Erro ao consultar método de pagamento padrão: ${err}`);
      return next(err);
    }
  }) as RequestHandler
);

export default metodoPagamentoRouter;
