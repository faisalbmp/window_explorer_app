import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

async function main() {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL environment variable is not set');
    const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
    const db = drizzle(migrationClient);
    console.log('Running database migrations...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations completed successfully.');
    await migrationClient.end();
}

main().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
});