// tests/user/deleteUser.test.ts
import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../../src/app';
import { Prisma } from '@prisma/client';


vi.mock('../../../src/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
}));

import { prisma } from '../../../src/lib/prisma';

describe('DELETE /api/users/:id', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 for invalid UUID', async () => {
        const res = await request(app).delete('/api/users/invalid-uuid');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Invalid user Id' });
    });

    it('should return 404 if user not found', async () => {
        prisma.user.findUnique.mockResolvedValue(null);

        const res = await request(app).delete('/api/users/123e4567-e89b-12d3-a456-426614174000');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'User not found' });
    });

    it('should return 400 if user already deleted', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: '123', deleted: true });

        const res = await request(app).delete('/api/users/123e4567-e89b-12d3-a456-426614174000');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'User already deleted' });
    });

    it('should delete user successfully', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: '123', deleted: false });
        prisma.user.update.mockResolvedValue({ id: '123', deleted: true, deleted_at: new Date() });

        const res = await request(app).delete('/api/users/123e4567-e89b-12d3-a456-426614174000');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'User deleted successfully' });

        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: '123e4567-e89b-12d3-a456-426614174000' },
            data: {
                deleted: true,
                deleted_at: expect.any(Date),
            },
        });
    });

    it('should return 404 if prisma throws P2025 error on update', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: '123', deleted: false });


        prisma.user.update.mockRejectedValue({ code: 'P2025' });

        const res = await request(app).delete('/api/users/123e4567-e89b-12d3-a456-426614174000');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'User not found' });
    });

    it('should return 500 for other errors', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: '123', deleted: false });
        prisma.user.update.mockRejectedValue(new Error('Unexpected error'));

        const res = await request(app).delete('/api/users/123e4567-e89b-12d3-a456-426614174000');
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Something went wrong' });
    });
});
