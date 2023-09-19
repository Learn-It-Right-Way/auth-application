import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
export class UserController {
    async registerUser(req: any, res: any) {
        try {
            // Configuration for sending emails
            const emailTransporter = nodemailer.createTransport({
                service: 'Gmail', // e.g., 'Gmail', 'Yahoo', etc.
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });

            // Generate a random confirmation token
            const confirmationToken = Math.random().toString(36).substring(2);
            // Set the confirmation link expiry (e.g., 48 hours from now)
            const confirmationExpiry = new Date();
            confirmationExpiry.setHours(confirmationExpiry.getHours() + 48); // Adjust the duration as needed

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
                    uuid: uuidv4(),
                    username,
                    email,
                    password: hashedPassword,
                    confirmationToken,
                    confirmationExpiry
                }
            });

            // Send a confirmation email to the user
            const confirmationLink = `${process.env.SERVER_URL}/confirm/${confirmationToken}`;
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Confirm Your Email',
                html: `Click <a href="${confirmationLink}">here</a> to confirm your email.`,
            };

            emailTransporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Email sending failed' });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(201).json({ message: 'User registered successfully. Check your email for confirmation.' });
                }
            });

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async confirm(req: any, res: any) {
        const token = req.params.token; // Extract the token from the URL
        console.log("===token===", token);
        // Look up the user by confirmation token in the database
        const user = await prisma.user.findFirst({
            where: {
                confirmationToken: token,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'Confirmation token not found or has been used' });
        }

        if (user.isConfirmed) {
            return res.status(400).json({ error: 'Email is already confirmed' });
        }

        // Check if the confirmation token has expired
        const currentTimestamp = new Date();
        if (user.confirmationExpiry && currentTimestamp > user.confirmationExpiry) {
            return res.status(400).json({ error: 'Confirmation token has expired' });
        }

        // Check if another user with the same email is already confirmed
        const userWithSameEmail = await prisma.user.findFirst({
            where: {
                email: user.email,
                isConfirmed: true,
            },
        });

        if (userWithSameEmail) {
            return res.status(400).json({ error: 'Another user with the same email is already confirmed' });
        }

        // Mark the token as used
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                isConfirmed: true,
                confirmationToken: null, // Optionally, clear the token to prevent further use
            },
        });

        res.status(200).json({ message: 'Email confirmed successfully' });
    }

    async login(req: any, res: any) {
        try {
            const { email, password } = req.body;

            // Find the user by email (you can also use username)
            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify the password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // If credentials are valid, generate a JWT token
            const token = jwt.sign(
                {
                    userId: user.uuid, // Include user-specific data in the token's payload (optional)
                },
                process.env.SECRET_KEY as string, // Replace with your secret key for token signing
                {
                    expiresIn: '1h', // Set the expiration time for the token (optional)
                }
            );

            // Set the JWT token in an HTTP-only cookie
            res.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true, // Set to true for HTTPS
                maxAge: 3600000, // 1 hour (adjust as needed)
                sameSite: 'strict', // Enforce same-site policy for added security
            });

            // Send a success response without the token in the body
            res.status(200).json({ isAuthenticated: true, user: { id: user.uuid, username: user.username, email: user.email } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async checkAuth(req: any, res: any) {
        const token = req.cookies.jwtToken; // Get the JWT token from the HTTP-only cookie

        try {
            if (!token) {
                return res.status(401).json({ isAuthenticated: false });
            }

            // Verify and decode the token using your secret key
            const decodedToken: any = jwt.verify(token, process.env.SECRET_KEY as string);

            // If verification is successful, you can access the user's data from the token payload
            const userUuid = decodedToken.userId; // Replace with the appropriate key used in your token payload

            // You can also perform additional checks or database queries to retrieve user details if needed
            // Find the user by email (you can also use username)
            const user = await prisma.user.findUnique({
                where: {
                    uuid: userUuid,
                },
            });

            if (!user) {
                // Send the user's details in the response
                return res.status(401).json({ error: 'Unauthenticated. Please Login again' });
            }

            res.json({ isAuthenticated: true, user: { id: user.uuid, username: user.username, email: user.email } });
        } catch (error) {
            console.error('Authentication check failed:', error);
            res.status(401).json({ isAuthenticated: false });
        }
    }
}