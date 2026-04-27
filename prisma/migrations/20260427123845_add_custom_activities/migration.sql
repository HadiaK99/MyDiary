-- AlterTable
ALTER TABLE "Activity" ADD COLUMN "userId" TEXT;

-- AlterTable
ALTER TABLE "ActivityCategory" ADD COLUMN "userId" TEXT;

-- CreateTable
CREATE TABLE "UserActivityConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "points" INTEGER
);

-- CreateTable
CREATE TABLE "UserCategoryConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "pointsPerItem" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "UserActivityConfig_userId_activityId_key" ON "UserActivityConfig"("userId", "activityId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCategoryConfig_userId_categoryId_key" ON "UserCategoryConfig"("userId", "categoryId");
