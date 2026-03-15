export declare class DocumentRepositoryService {
    upload(opts: {
        cbId: string;
        docType: 'internal' | 'external';
        category: string;
        title: string;
        version?: string;
        source?: string;
        issueDate?: string;
        expiryDate?: string;
        fileBuffer: Buffer;
        fileName: string;
        mimeType: string;
        uploadedBy: string;
    }): Promise<any>;
    addExternalLink(opts: {
        cbId: string;
        title: string;
        category: string;
        source: string;
        externalUrl: string;
        issueDate?: string;
        expiryDate?: string;
        uploadedBy: string;
    }): Promise<any>;
    getMasterList(cbId: string, docType?: 'internal' | 'external'): Promise<any[]>;
    getSignedUrl(storagePath: string, expiresInSeconds?: number): Promise<string>;
    softDelete(documentId: string): Promise<void>;
    restore(documentId: string): Promise<void>;
    permanentDelete(documentId: string, storagePath: string | null): Promise<void>;
    getRecycleBin(cbId: string): Promise<any[]>;
}
//# sourceMappingURL=documentService.d.ts.map