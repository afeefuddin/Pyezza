-- Add admin role marker on users
ALTER TABLE "User"
ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;
