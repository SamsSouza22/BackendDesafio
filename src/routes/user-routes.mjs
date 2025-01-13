import { publicRouter, privateRouter } from "./router.mjs";
import UserController from "../controllers/user-controller.mjs";

const userController = new UserController();

publicRouter.post('/register', (req, res) => userController.register(req, res));
publicRouter.post('/login', (req, res) => userController.login(req, res));
privateRouter.post('/logout', (req, res) => userController.logout(req, res)); 