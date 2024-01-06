import express, { NextFunction } from "express";
import { Request, Response } from "express";

import PagamentoRepository from "~datasources/database/repository/pagamentoDatabaseRepository";
// import { PagamentoController } from "~interfaceAdapters/controllers/pagamentoController";

// import authenticate from "../middleware/auth";

// import { validaRequisicao } from "./utils";

const pagamentoRouter = express.Router();

const dbPagamentoRepository = new PagamentoDatabaseRepository();

/**
 * @openapi
 * /pagamento:
 *   post:
 *     summary: Recebe confirmação ou negação de pagamento (Para teste pagamentoId=7ef6e15a-9f11-40fe-9d19-342505377600 )
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
 *               pagamentoId:
 *                 type: string
 *                 default: 7ef6e15a-9f11-40fe-9d19-342505377600
 *               faturaId:
 *                 type: string
 *               isPago:
 *                 type: boolean
 *               valorPagamento:
 *                 type: number
 *               tipoDePagamento:
 *                 type: string
 *                 default: "QRCode"
 *     responses:
 *       200:
 *         description: lista de metodos de pagamento.
 *       500:
 *         description: Erro na api.
 */
pagamentoRouter.get(
  "/:id",
  authenticate(TipoUsuario.ADMIN),
  validaRequisicao(RecebimentoDePagamentosSchema),
  async (
    req: Request<ListaStatusPagto, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const categoria = await PagamentoController.retornaStatusPagtoPedido(
        pagamentoRepository,
        id
      );

      // TODO: separar util de obj resposta
      if (categoria) {
        return res.status(200).json({
          status: "success",
          categoria,
        });
      }

      throwError("NOT_FOUND", "Categoria não encontrada!");
    } catch (err: unknown) {
      console.log(`Erro ao criar  pagamento: ${err}`);
      return next(err);
    }
  }
);

export default pagamentoRouter;
