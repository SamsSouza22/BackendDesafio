import prismaClient from '../utils/prismaClient.mjs';
import { postSchema } from '../utils/schemas.mjs';

class PostController {
    
    async getPosts(req, res) {
        const { page = 1, perPage = 10 } = req.query;
        const skip = (page - 1) * perPage;
        const take = parseInt(perPage);

        try {
            const posts = await prismaClient.post.findMany({
                skip,
                take,
                orderBy: {
                    updatedAt: 'desc'
                },
                include: {
                    author: {
                        select: {
                            name: true
                        },
                    },
                },
            });
            
            const totalPosts = await prismaClient.post.count();
            const totalPages = Math.ceil(totalPosts / perPage);

            res.status(200).json({ 
                page: parseInt(page),
                perPage: parseInt(perPage),
                totalPages,
                totalPosts,
                posts
             });

        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Could not get posts' });

        }
    }

    async createPost(req, res) {
        const userId = req.logged_user.id;
        const post = postSchema.parse(req.body);

        try {
            const newPost = await prismaClient.post.create({
                data: {
                    ...post,
                    author: {
                        connect: {
                            id: userId
                        }
                    }
                }
            });

            res.status(201).json({ message: "Post created", post: newPost });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    }

    async updatePost(req, res) {
        const userId = req.logged_user.id;
        const { id } = req.params;
        const post = postSchema.parse(req.body);

        try {
            const postExists = await prismaClient.post.findFirst({ where: { id, authorid: userId } });
            if (!postExists) {
                return res.status(404).json({ error: 'Post not found' });
            }

            const updatedPost = await prismaClient.post.update({
                where: { id },
                data: post
            });

            res.send(updatedPost);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Could not update post' });
        }
    }

    async deletePost(req, res) {
        const userId = req.logged_user.id;
        const { id } = req.params;

        try {
            const postExists = await prismaClient.post.findFirst({ where: { id, authorid: userId } });
            if (!postExists) {
                return res.status(404).json({ error: 'Post not found' });
            }

            await prismaClient.post.delete({ where: { id } });
            res.status(204).send("Post deleted");
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Could not delete post' });
        }
    }
}

export default PostController;
