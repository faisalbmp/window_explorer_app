import type { FsTreeNode, FsContentNode } from '~/types';
export class ApiService {
  private readonly baseUrl: string;
  constructor(baseUrl: string) { this.baseUrl = baseUrl; }
  private async fetchAPI<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.data as T;
  }
  public getFolderTree = () => this.fetchAPI<FsTreeNode[]>('/folders/tree');
  public getFolderContents = (id: number | 'root') => this.fetchAPI<FsContentNode[]>(`/folders/${id}/contents`);
}