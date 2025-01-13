import { z } from 'zod';

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

export { userSchema, authSchema, postSchema };