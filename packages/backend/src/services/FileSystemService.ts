import { FileSystemRepository } from './FileSystemRepository';
export interface FsNode { id: number; name: string; parentId: number | null; children: FsNode[]; }
export class FileSystemService {
    private repo: FileSystemRepository;
    constructor(repo: FileSystemRepository) { this.repo = repo; }
    async getFolderTree(): Promise<FsNode[]> {
        const allFolders = await this.repo.findAllFolders();
        if (!allFolders.length) return [];
        const nodeMap: Map<number, FsNode> = new Map();
        allFolders.forEach(folder => nodeMap.set(folder.id, { id: folder.id, name: folder.name, parentId: folder.parentId, children: [] }));
        const tree: FsNode[] = [];
        allFolders.forEach(folder => {
            if (folder.parentId && nodeMap.has(folder.parentId)) nodeMap.get(folder.parentId)?.children.push(nodeMap.get(folder.id)!);
            else tree.push(nodeMap.get(folder.id)!);
        });
        return tree;
    }
    async getFolderContents(folderId: string | number) {
        const parentId = folderId === 'root' ? null : Number(folderId);
        if (folderId !== 'root' && (typeof parentId !== 'number' || isNaN(parentId))) throw new Error('Invalid folder ID');
        if (parentId !== null) {
            const parentFolder = await this.repo.findById(parentId);
            if (!parentFolder || parentFolder.type !== 'folder') return null;
        }
        return this.repo.findChildrenOf(parentId);
    }
}