import { publicRouter, privateRouter } from "./router.mjs";
import UserController from "../controllers/user-controller.mjs";

const userController = new UserController();

publicRouter.post('/register', (req, res) => userController.register(req, res));
publicRouter.post('/login', (req, res) => userController.login(req, res));
publicRouter.get('/posts', (req, res) => userController.getPosts(req, res));
privateRouter.post('/posts', (req, res) => userController.createPost(req, res));
privateRouter.put('/posts/:id', (req, res) => userController.updatePost(req, res));
privateRouter.delete('/posts/:id', (req, res) => userController.deletePost(req, res));