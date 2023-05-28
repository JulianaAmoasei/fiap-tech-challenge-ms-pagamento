import ProdutoService from "core/applications/services/produtoService";
import { Request, Response } from "express";

export default class ProdutoController {
    constructor(private readonly produtoService: ProdutoService) { }

    async criarProduto(req: Request, res: Response) {
        const produto = req.body;

        const produtoCriado = await this.produtoService.criarProduto(produto);
        return res.status(201).json({
            status: "success",
            message: produtoCriado,
        });
    }

    async deletarProduto(req: Request, res: Response) {
        const { id } = req.params;

        const produtoDeletado = await this.produtoService.deletarProduto(id);
        return res.status(200).json({
            status: "success",
            message: produtoDeletado,
        });
    }

    async editarProduto(req: Request, res: Response) {
        const { id } = req.params;
        const produto = req.body;

        const produtorAtualizado = await this.produtoService.editarProduto(id, produto);
        return res.status(200).json({
            status: "success",
            message: produtorAtualizado,
        });
    }

    async listarProdutos(req: Request, res: Response) {
        const produtos = await this.produtoService.listarProdutos();
        console.log(produtos)
        return res.status(200).json({
            status: "success",
            produtos,
        });
    }

    async pegarProduto(req: Request, res: Response) {
        const { id } = req.params;

        const produto = await this.produtoService.pegarProduto(id);
        return res.status(200).json({
            status: "success",
            produto,
        });
    }
}