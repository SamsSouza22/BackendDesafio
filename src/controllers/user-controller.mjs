import prismaClient from '../utils/prismaClient.mjs';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jsonwebtoken from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets.mjs';

const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
});

const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

const postSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1)
});

class UserController {
    async register(req, res) {
        const { email } = req.body;
        const user = userSchema.parse(req.body);

        const userExists = await prismaClient.user.findUnique({ where: { email } });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(user.password, salt);

        const newUser = await prismaClient.user.create({
            data: {
                ...user,
                password: hashPassword
            }
        });

        delete newUser.password;

        res.send(newUser);
    }

    async login(req, res) {
        const { email, password } = req.body;
        authSchema.parse({ email, password });

        const user = await prismaClient.user.findFirst({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const newUser = { id: user.id, name: user.name, email: user.email };
        const token = jsonwebtoken.sign(newUser, JWT_SECRET);

        res.send({ token });
    }

    async getPosts(req, res) {
        const { page = 1, perPage = 10 } = req.query;
        const skip = (page - 1) * perPage;
        const take = parseInt(perPage);

        try {
            const posts = await prismaClient.post.findMany({
                skip,
                take,
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

export default UserController;