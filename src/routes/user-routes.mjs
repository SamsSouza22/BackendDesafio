import { privateRouter, publicRouter } from "./router.mjs";
import { UserController } from "../controllers/user-controller.mjs";

const userController = new UserController();

publicRouter.post('/register', (req, res) => userController.register(req, res));
privateRouter.post('/login', (req, res) => userController.login(req, res));