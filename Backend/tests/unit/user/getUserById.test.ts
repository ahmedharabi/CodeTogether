// @ts-ignore
import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../../src/app';

vi.mock('../../../src/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
        },
    },
}));

import { prisma } from '../../../src/lib/prisma';

describe('GET api/users/:id', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 if id is invalid UUID', async () => {
        const invalidId = '123-not-uuid';
        const res = await request(app).get(`/api/users/${invalidId}`);

        console.log('Response status:', res.status);
        console.log('Response body:', res.body);
        console.log('Response headers:', res.headers);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({error: 'Invalid user id'});
    });

    it('should return 404 if user not found', async () => {
        const validId = '11111111-1111-4111-9111-111111111111';
        prisma.user.findUnique.mockResolvedValue(null);

        const res = await request(app).get(`/api/users/${validId}`);


        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'User not found' });
    });

})