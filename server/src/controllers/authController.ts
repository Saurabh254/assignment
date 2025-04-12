import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import logger from '../config/logger';

const prisma = new PrismaClient();

// Validation schemas
const registerSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    rollNumber: z.string().min(1).max(20),
    class: z.string().min(1).max(10),
    role: z.enum(['student', 'teacher']).optional().default('student')
});

const loginSchema = z.object({
    rollNumber: z.string().min(1).max(20),
    password: z.string().min(6)
});

// Register new user
export const register = async (req: Request, res: Response) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        logger.info('Attempting to register new user', { email: validatedData.email, role: validatedData.role });

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                rollNumber: validatedData.rollNumber
            }
        });

        if (existingUser) {
            logger.warn('Registration failed: User already exists', { rollNumber: validatedData.rollNumber });
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                rollNumber: validatedData.rollNumber,
                class: validatedData.class,
                role: validatedData.role
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        logger.info('User registered successfully', { userId: user.id, role: user.role });

        return res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNumber: user.rollNumber,
                class: user.class
            }
        });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            logger.warn('Registration validation failed', { errors: error.errors });
            return res.status(400).json({ error: error.errors });
        }
        logger.error('Error registering user:', { error: error instanceof Error ? error.message : 'Unknown error' });
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Login user
export const login = async (req: Request, res: Response) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        logger.info('Attempting user login', { rollNumber: validatedData.rollNumber });

        // Find user by roll number
        const user = await prisma.user.findUnique({
            where: { rollNumber: validatedData.rollNumber }
        });

        if (!user) {
            logger.warn('Login failed: User not found', { rollNumber: validatedData.rollNumber });
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
        if (!isValidPassword) {
            logger.warn('Login failed: Invalid password', { rollNumber: validatedData.rollNumber });
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        logger.info('User logged in successfully', { userId: user.id, role: user.role });

        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNumber: user.rollNumber,
                class: user.class
            }
        });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            logger.warn('Login validation failed', { errors: error.errors });
            return res.status(400).json({ error: error.errors });
        }
        logger.error('Error logging in:', { error: error instanceof Error ? error.message : 'Unknown error' });
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        logger.info('Fetching current user profile', { userId });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                class: true,
                rollNumber: true,
            },
        });

        if (!user) {
            logger.warn('User profile not found', { userId });
            return res.status(404).json({ error: 'User not found' });
        }

        logger.info('User profile fetched successfully', { userId });
        res.json(user);
    } catch (error) {
        logger.error('Error fetching user profile:', {
            userId: req.user?.id,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        res.status(500).json({ error: 'Failed to get current user' });
    }
};