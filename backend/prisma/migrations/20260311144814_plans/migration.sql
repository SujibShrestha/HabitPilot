-- CreateTable
CREATE TABLE "TrainingPlans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "plan_json" JSONB NOT NULL,
    "plan_text" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingPlans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_training_plans_user_id" ON "TrainingPlans"("user_id");
