-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';

-- AlterTable
ALTER TABLE "Workspace" ALTER COLUMN "logo_url" DROP NOT NULL;
