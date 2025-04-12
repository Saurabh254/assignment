import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

        // Get user from database to ensure it still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
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
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Middleware to check if user is a teacher
export const isTeacher = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'teacher') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Teacher only.' });
    }
};

// Middleware to check if user is a student
export const isStudent = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Student only.' });
    }
};