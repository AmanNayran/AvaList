import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UsuarioInterface } from '../interfaces/user'
import UsuarioModel from "../models/user"

class AuthMiddleware {
    public authUserToken(req: Request, res: Response, next: NextFunction) {
        const token = req.query.token || req.headers['acess-token'];

        if (!token) {
            return res.status(401).send({ message: 'Acesso negado' })
        }

        try {
            const userToken = jwt.verify(token, 'secret') as unknown as UsuarioInterface;
            const user = await UsuarioModel.findById(userToken._id);
    
            if (!user) {
                return res.status(400).send({ message: 'Usuário não existe' })
            }
            return next();
        } catch (error) {
            return res.status(401).send({ message: 'Token invalido' })
        }
        

    }
}

export default new AuthMiddleware();