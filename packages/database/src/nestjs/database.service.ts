import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { db, pool, TDatabase } from "@repo/db";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  public readonly db: TDatabase;
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    this.db = db;

    this.logger.log("Database connected");
  }

  async onModuleDestroy() {
    this.logger.log("Database disconnected");
    await pool.end();
  }
}
