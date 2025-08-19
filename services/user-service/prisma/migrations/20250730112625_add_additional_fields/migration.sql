-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "age" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mobileNumber" TEXT,
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
