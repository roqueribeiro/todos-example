import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTasks1724150000000 implements MigrationInterface {
    name = 'InitTasks1724150000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "tasks" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "title" varchar(200) NOT NULL,
            "description" text,
            "status" varchar(20) NOT NULL DEFAULT 'todo',
            "dueDate" TIMESTAMP NULL,
            "priority" varchar(10) NOT NULL DEFAULT 'medium',
            "tags" jsonb NOT NULL DEFAULT '[]',
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
    }
}
