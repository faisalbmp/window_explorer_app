import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq, isNull } from 'drizzle-orm';
import { fsNodes } from '../db/schema';
import * as schema from '../db/schema';

export class FileSystemRepository {
    private db: PostgresJsDatabase<typeof schema>;
    constructor(client: PostgresJsDatabase<typeof schema>) { this.db = client; }
    async findAllFolders() { return this.db.select().from(fsNodes).where(eq(fsNodes.type, 'folder')); }
    async findChildrenOf(folderId: number | null) {
        const query = this.db.select({ id: fsNodes.id, name: fsNodes.name, type: fsNodes.type, parentId: fsNodes.parentId }).from(fsNodes);
        return folderId === null ? query.where(isNull(fsNodes.parentId)) : query.where(eq(fsNodes.parentId, folderId));
    }
    async findById(id: number) { const result = await this.db.select().from(fsNodes).where(eq(fsNodes.id, id)).limit(1); return result[0] || null; }
}