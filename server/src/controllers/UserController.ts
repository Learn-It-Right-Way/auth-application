import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export class UserController {
    async registerUser(req: any, res: any) {
        try {
            const { username, email, password } = req.body;

            // Check if the user already exists (usually done with a database query)
            // Check if the user already exists in the database
            const existingUser = await prisma.user.findUnique({
                where: {
                    username,
                },
            });

            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Generate a salt (bcrypt automatically handles this for you)
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);

            // Hash the password with the salt
            const hashedPassword = await bcrypt.hash(password, salt);

            // Store the user data (usually done with database insertion)
            // Insert a new user into the database
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword
                }
            });

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}