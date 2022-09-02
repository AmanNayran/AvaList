import { Request, Response, NextFunction } from 'express'
import { UserInterface } from '../interfaces/user'
import UserModel from "../models/user"
import jwt from 'jsonwebtoken'

class AuthMiddleware {
    public authUserToken(req: Request, res: Response, next: NextFunction) {
        const token = req.query.token || req.headers['acess-token']

        if (!token) {
            return res.status(401).send({ error: 'Acess denied' })
        }

        try {
            const userToken = jwt.verify(token, 'secret') as UserInterface;
            const user = UserModel.findById(userToken._id)
    
            if (!user) {
                return res.status(400).send({ error: 'User not found' })
            }
            return next()
        } catch (error) {
            return res.status(401).send({ error: 'Token invalid' })
        }
    }
}

export default new AuthMiddleware();