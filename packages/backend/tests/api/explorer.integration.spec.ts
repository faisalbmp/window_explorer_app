import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

// Import the factory function instead of a pre-built app instance.
import { createApp } from '../../src/app'; 
import { fsNodes } from '../../src/db/schema';

describe('Explorer API Integration Tests', () => {
    let app: ReturnType<typeof createApp>;
    let testDbConnection: ReturnType<typeof postgres>;
    let testDb: ReturnType<typeof drizzle>;

    beforeAll(async () => {
        const testDbUrl = process.env.TEST_DATABASE_URL;
        if (!testDbUrl) {
            throw new Error("TEST_DATABASE_URL is not set. Please configure it in a .env file.");
        }

        // Create a dedicated app instance for testing, connected to the test database.
        // This is the critical step.
        app = createApp(testDbUrl);

        // Set up a separate connection for seeding/cleaning the test database.
        testDbConnection = postgres(testDbUrl);
        testDb = drizzle(testDbConnection);
        await migrate(testDb, { migrationsFolder: './drizzle' });
        
        await testDb.delete(fsNodes);
        const [docs] = await testDb.insert(fsNodes).values({ name: 'Test Docs', type: 'folder' }).returning();
        await testDb.insert(fsNodes).values([{ name: 'Report.pdf', type: 'file', parentId: docs.id }]);
    });

    afterAll(async () => {
        await testDb.delete(fsNodes);
        await testDbConnection.end();
    });

    it('GET /api/v1/folders/tree should return the folder structure from the test database', async () => {
        // The `app` instance was created with the test DB URL, so it's guaranteed to be using the right one.
        const response = await (await app).handle(new Request('http://localhost/api/v1/folders/tree'));
        const body = await response.json();
        
        expect(response.status).toBe(200);
        expect((body as { data: unknown[] }).data).toBeArray();
        expect((body as { data: Array<{ name: string }> }).data.find(f => f.name === 'Test Docs')).toBeDefined();
    });
});
