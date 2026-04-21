-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "realName" TEXT,
    "fathersName" TEXT,
    "mothersName" TEXT,
    "dob" TEXT,
    "school" TEXT,
    "bloodGroup" TEXT,
    "zodiacSign" TEXT,
    "address" TEXT,
    "favColor" TEXT,
    "favColorCode" TEXT,
    "favFood" TEXT,
    "favPlace" TEXT,
    "favBook" TEXT,
    "hobbies" TEXT,
    "personalGoals" TEXT,
    "picture" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
