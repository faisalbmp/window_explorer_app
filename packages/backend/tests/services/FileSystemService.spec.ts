import { describe, it, expect, mock } from 'bun:test';
import { FileSystemService } from '../../src/services/FileSystemService';
import type { FileSystemRepository } from '../../src/services/FileSystemRepository';

describe('FileSystemService', () => {
    it('should correctly build a folder tree from a flat list', async () => {
        // Arrange
        const mockFlatFolders = [
            { id: 1, name: 'Root 1', type: 'folder', parentId: null, createdAt: new Date(), updatedAt: new Date() },
            { id: 2, name: 'Child 1.1', type: 'folder', parentId: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 3, name: 'Root 2', type: 'folder', parentId: null, createdAt: new Date(), updatedAt: new Date() },
            { id: 4, name: 'Child 1.2', type: 'folder', parentId: 1, createdAt: new Date(), updatedAt: new Date() },
            { id: 5, name: 'Grandchild 1.1.1', type: 'folder', parentId: 2, createdAt: new Date(), updatedAt: new Date() },
        ];

        const mockRepo: Partial<FileSystemRepository> = {
            findAllFolders: async () => mockFlatFolders,
        };

        const service = new FileSystemService(mockRepo as FileSystemRepository);

        // Act
        const tree = await service.getFolderTree();

        // Assert
        expect(tree).toBeArray();
        expect(tree.length).toBe(2); // Two root nodes

        // Check Root 1
        const root1 = tree.find(n => n.id === 1);
        expect(root1).toBeDefined();
        expect(root1?.children.length).toBe(2);

        // Check Child 1.1
        const child1_1 = root1?.children.find(n => n.id === 2);
        expect(child1_1).toBeDefined();
        expect(child1_1?.children.length).toBe(1);

        // Check Grandchild
        const grandchild = child1_1?.children.find(n => n.id === 5);
        expect(grandchild).toBeDefined();
        expect(grandchild?.children.length).toBe(0);

        // Check Root 2
        const root2 = tree.find(n => n.id === 3);
        expect(root2).toBeDefined();
        expect(root2?.children.length).toBe(0);
    });
});