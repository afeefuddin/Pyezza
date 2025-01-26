-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('slack', 'zulip');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "imageUrl" TEXT,
    "name" TEXT,
    "externalProviderId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "token" TEXT,
    "type" "IntegrationType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "botUserId" TEXT,
    "teamName" TEXT,
    "teamId" TEXT NOT NULL,
    "appId" TEXT,
    "channelId" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_externalProviderId_key" ON "User"("externalProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_publicId_key" ON "Integration"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_teamId_key" ON "Integration"("teamId");

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
