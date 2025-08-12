// tests/user/getAllUsers.test.ts
// @ts-ignore
import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {app} from '../../../src/app';
vi.mock('../../../src/lib/prisma', () => ({
    prisma: {
        user: {
            findMany: vi.fn(),
            count: vi.fn(),
        },
    },
}));


import { prisma } from '../../../src/lib/prisma';

describe('GET api/users', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return paginated users with default params', async () => {
        const mockUsers = [
            { full_name: 'John Doe', email: 'john@example.com',  bio: 'Bio', role: 'user', avatar_url: null }
        ];

        prisma.user.findMany.mockResolvedValue(mockUsers);
        prisma.user.count.mockResolvedValue(1);

        const res = await request(app).get('/api/users');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Users fetched successfully');
        expect(res.body.data).toEqual(mockUsers);
        expect(res.body.pagination).toEqual({
            page: 1,
            pageSize: 10,
            total: 1
        });
        expect(res.body.sorting).toEqual({
            sortBy: 'full_name',
            order: 'asc'
        });
    });

    it('should return 500 if prisma throws an error', async () => {
        prisma.user.findMany.mockRejectedValue(new Error('DB error'));

        const res = await request(app).get('/api/users');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Failed to fetch users' });
    });
});
