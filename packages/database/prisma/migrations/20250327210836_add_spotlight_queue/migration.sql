-- CreateTable
CREATE TABLE "SpotlightMessageQueue" (
    "id" SERIAL NOT NULL,
    "channelId" INTEGER NOT NULL,
    "members" TEXT[],

    CONSTRAINT "SpotlightMessageQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpotlightMessageQueue_channelId_key" ON "SpotlightMessageQueue"("channelId");

-- AddForeignKey
ALTER TABLE "SpotlightMessageQueue" ADD CONSTRAINT "SpotlightMessageQueue_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
