export interface IS3Service {
    getUploadUrl(key: string, contentType: string): Promise<string>
}