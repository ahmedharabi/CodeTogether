import {vi} from "vitest"
// __mocks__/prismaClient.ts
export const prisma = {
    user: {
        findMany: vi.fn(),
        count: vi.fn()
    }
}
