import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { fsNodes } from './schema';
import 'dotenv/config';

async function main() {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL environment variable is not set');
    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client);

    console.log('Seeding database...');
    await db.delete(fsNodes);

    const [documents] = await db.insert(fsNodes).values({ name: 'Documents', type: 'folder' }).returning();
    const [pictures] = await db.insert(fsNodes).values({ name: 'Pictures', type: 'folder' }).returning();
    const [applications] = await db.insert(fsNodes).values({ name: 'Applications', type: 'folder' }).returning();
    await db.insert(fsNodes).values({ name: 'README.md', type: 'file' });
    const [work] = await db.insert(fsNodes).values({ name: 'Work', type: 'folder', parentId: documents.id }).returning();
    await db.insert(fsNodes).values({ name: 'Personal', type: 'folder', parentId: documents.id }).returning();
    const [projectA] = await db.insert(fsNodes).values({ name: 'Project Alpha', type: 'folder', parentId: work.id }).returning();
    await db.insert(fsNodes).values({ name: 'specs.pdf', type: 'file', parentId: projectA.id });
    const [vacation] = await db.insert(fsNodes).values({ name: 'Vacation 2024', type: 'folder', parentId: pictures.id }).returning();
    await db.insert(fsNodes).values({ name: 'beach.png', type: 'file', parentId: vacation.id });
    
    console.log('Database seeded successfully!');
    await client.end();
}

main().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});