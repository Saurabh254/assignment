import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for profile updates
const updateProfileSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    class: z.string().optional(),
    rollNumber: z.string().min(3).max(30),
});

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                class: true,
                rollNumber: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json(user);
    } catch (error: unknown) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const validatedData = updateProfileSchema.parse(req.body);

        // Check if email is being updated and if it's already in use
        if (validatedData.email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: validatedData.email,
                    NOT: {
                        id: userId,
                    },
                },
            });

            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: validatedData,
            select: {
                id: true,
                name: true,
                email: true,
                class: true,
                rollNumber: true,
                updatedAt: true,
            },
        });

        return res.json(updatedUser);
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};