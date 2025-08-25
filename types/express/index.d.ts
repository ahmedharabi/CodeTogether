import { User } from '@prisma/client'; // Optional: use your Prisma model

declare global {
    namespace Express {
        interface User {
            id: string;
            full_name: string | null;
            username: string | null;
            email: string;
            password_hash: string | null;
            google_id: string | null;
            github_id: string | null;
            avatar_url: string | null;
            bio: string | null;
            role: string | null;
            workspaceMembers: any;
            joined_at: Date;
            last_active: Date | null;
            deleted: boolean;
            deleted_at: Date | null;
        }

    }
}
