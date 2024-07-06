-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_room_id_nickname_key" ON "participants"("room_id", "nickname");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
