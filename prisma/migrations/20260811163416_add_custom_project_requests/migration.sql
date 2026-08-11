-- CreateEnum
CREATE TYPE "CustomProjectStatus" AS ENUM ('NEW', 'REVIEWING', 'QUOTED', 'ACCEPTED', 'REJECTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "CustomProjectRequest" (
    "id" SERIAL NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "material" TEXT,
    "finish" TEXT,
    "usage" TEXT,
    "lengthValue" DECIMAL(65,30),
    "widthValue" DECIMAL(65,30),
    "heightValue" DECIMAL(65,30),
    "dimensionUnit" TEXT,
    "quantity" INTEGER,
    "needsRecommendation" BOOLEAN NOT NULL DEFAULT false,
    "customerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "vatNumber" TEXT,
    "county" TEXT,
    "city" TEXT,
    "notes" TEXT,
    "status" "CustomProjectStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomProjectRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomProjectFile" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "requestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomProjectFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomProjectRequest_requestNumber_key" ON "CustomProjectRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "CustomProjectRequest_requestNumber_idx" ON "CustomProjectRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "CustomProjectRequest_status_idx" ON "CustomProjectRequest"("status");

-- CreateIndex
CREATE INDEX "CustomProjectRequest_email_idx" ON "CustomProjectRequest"("email");

-- CreateIndex
CREATE INDEX "CustomProjectRequest_createdAt_idx" ON "CustomProjectRequest"("createdAt");

-- CreateIndex
CREATE INDEX "CustomProjectRequest_projectType_idx" ON "CustomProjectRequest"("projectType");

-- CreateIndex
CREATE UNIQUE INDEX "CustomProjectFile_pathname_key" ON "CustomProjectFile"("pathname");

-- CreateIndex
CREATE INDEX "CustomProjectFile_requestId_idx" ON "CustomProjectFile"("requestId");

-- CreateIndex
CREATE INDEX "CustomProjectFile_requestId_position_idx" ON "CustomProjectFile"("requestId", "position");

-- AddForeignKey
ALTER TABLE "CustomProjectFile" ADD CONSTRAINT "CustomProjectFile_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "CustomProjectRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
