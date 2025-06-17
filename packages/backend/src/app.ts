import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { FileSystemRepository } from './services/FileSystemRepository';
import { FileSystemService } from './services/FileSystemService';

/**
 * Creates and configures the Elysia application.
 * This factory function allows us to create separate app instances for production and testing.
 * @param dbUrl - The database connection string.
 * @returns A configured Elysia app instance.
 */
export const createApp = async (dbUrl: string) => {
    // Each app instance gets its own database connection and services.
    const client = postgres(dbUrl);
    const schema = await import('./db/schema');
    const db = drizzle(client, { schema });
    const fileSystemRepo = new FileSystemRepository(db as any);
    const fileSystemService = new FileSystemService(fileSystemRepo);

    // Define the API routes as a plugin.
    const explorerApi = new Elysia({ prefix: '/api/v1' })
        // Inject the services into the context for this plugin.
        .decorate('fileSystemService', fileSystemService)
        .get('/folders/tree', ({ fileSystemService }) => 
            fileSystemService.getFolderTree().then(data => ({ data }))
        )
        .get('/folders/:id/contents', async ({ params, error, fileSystemService }) => {
            const folderId = params.id === 'root' ? 'root' : parseInt(params.id, 10);
            if (params.id !== 'root' && isNaN(folderId as number)) return error(400, 'Invalid folder ID');
            
            const contents = await fileSystemService.getFolderContents(folderId);
            if (contents === null) return error(404, `Folder with ID '${params.id}' not found.`);
            return { data: contents };
        }, { params: t.Object({ id: t.String() }) });
        
    // Build the main app.
    const app = new Elysia()
        .use(cors())
        .use(swagger({ path: '/api/docs' }))
        .use(explorerApi);

    return app;
};