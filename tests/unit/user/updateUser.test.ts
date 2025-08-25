import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../../src/app';

vi.mock('../../../src/lib/prisma', () => ({
    prisma: {
        user: {
            update: vi.fn(),
        },
    },
}));

import { prisma } from '../../../src/lib/prisma';

describe('PUT /api/users/:id', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const validId = '123e4567-e89b-12d3-a456-426614174000'; // example UUID
    const validBody = {
        full_name: 'Updated Name',
        email: 'updated@example.com',
        bio: 'Updated bio',
        role: 'user',
        avatar_url: "http://example.com/avatar.png",
    };

    it('should update user successfully', async () => {
        const updatedUser = {id: validId, ...validBody};
        prisma.user.update.mockResolvedValue(updatedUser);

        const res = await request(app).put(`/api/users/${validId}`).send(validBody);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User updated sucessfully');
        expect(res.body.user).toEqual(updatedUser);

    });

    it('should return 400 if validation fails', async () => {
        const invalidBody = { full_name: '' };

        const res = await request(app).put(`/api/users/${validId}`).send(invalidBody);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('validation error');

    });

    it('should return 404 if user not found', async () => {
        prisma.user.update.mockRejectedValueOnce({

            code: 'P2025',
        });

        const res = await request(app).put(`/api/users/${validId}`).send(validBody);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ err: 'User not found' });
    });

    it('should return 500 on other errors', async () => {
        prisma.user.update.mockRejectedValueOnce(new Error('Some error'));

        const res = await request(app).put(`/api/users/${validId}`).send(validBody);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Something went wrong' });
    });

})