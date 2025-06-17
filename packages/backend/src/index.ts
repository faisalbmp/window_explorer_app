import { createApp } from './app';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create the app instance for the actual server using the development DB URL.
const app = createApp(dbUrl);

(await app).listen(process.env.PORT || 3000, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at http://${hostname}:${port}`);
});
