import { Request, Response } from "express";
import UsuarioModel from "../models/user"

class UsuarioController {
    public async cadastrar(req: Request, res: Response): Promise<Response> {
        const user = await UsuarioModel.create(req.body);
        const mensagem = {
            message: 'Usuario cadastrado com sucesso!',
            _id: user._id,
            nome: user.nome,
            email: user.email,
            senha: user.senha
        }
        return res.json(mensagem);
    }

    public async autenticar(req: Request, res: Response): Promise<Response> {
        const { nome, senha } = req.body;

        const user = await UsuarioModel.findOne({ nome });
        if (!user) {
            return res.status(400).send({ message: 'Usuario nao encontrado!'});
        }

        const senhaValida = await user.compararSenhas(senha);
        if (!senhaValida) {
            return res.status(400).send({ message: 'Senha invalida!'});
        }

        return res.json(user);
    }
}

export default new UsuarioController();