import { publicRouter, privateRouter } from "./router.mjs";
import PostController from "../controllers/post-controller.mjs";

const postController = new PostController();

publicRouter.get('/posts', (req, res) => postController.getPosts(req, res));
privateRouter.post('/posts', (req, res) => postController.createPost(req, res));
privateRouter.put('/posts/:id', (req, res) => postController.updatePost(req, res));
privateRouter.delete('/posts/:id', (req, res) => postController.deletePost(req, res));
privateRouter.post('/suggestions',(req, res) => postController.suggestionsAI(req,res));