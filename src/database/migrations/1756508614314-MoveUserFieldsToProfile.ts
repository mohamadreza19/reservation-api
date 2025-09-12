import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveUserFieldsToProfile1756508614314
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create profile table
    await queryRunner.query(`
            CREATE TABLE "profile" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "img" character varying,
                "userId" uuid,
                CONSTRAINT "UQ_profile_phoneNumber" UNIQUE ("phoneNumber"),
                CONSTRAINT "REL_profile_userId" UNIQUE ("userId"),
                CONSTRAINT "PK_profile_id" PRIMARY KEY ("id")
            )
        `);

    // 2. Add foreign key to user
    await queryRunner.query(`
            ALTER TABLE "profile"
            ADD CONSTRAINT "FK_profile_userId"
            FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
        `);

    // 3. Copy data from user into profile
    await queryRunner.query(`
            INSERT INTO profile ("id", "name", "phoneNumber", "img", "userId", "createdAt", "updatedAt")
            SELECT uuid_generate_v4(), name, "phoneNumber", NULL, id, now(), now()
            FROM "user"
        `);

    // 4. Drop old columns from user
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Add columns back to user
    await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "phoneNumber" character varying NOT NULL`,
    );

    // 2. Copy data back from profile
    await queryRunner.query(`
            UPDATE "user"
            SET "name" = p."name",
                "phoneNumber" = p."phoneNumber"
            FROM "profile" p
            WHERE p."userId" = "user"."id"
        `);

    // 3. Drop profile table
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
