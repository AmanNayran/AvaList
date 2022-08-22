import { Router } from "express";
import usuarioController from '../controller/user'

const userRoute = Router();

userRoute.post('/singup', usuarioController.cadastrar)
userRoute.post('/singin', usuarioController.autenticar)

export default userRoute;