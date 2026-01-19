import { IS3Service } from "../../domain/interfaces/services/IS3Service";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from '../../config/envValidation'


const s3 = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY!,
        secretAccessKey: env.AWS_SECRET_KEY!
    },
})

export class S3Service implements IS3Service {
    async getUploadUrl(key: string, contentType: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: env.AWS_BUCKET_NAME!,
            Key: key,
            ContentType: contentType,
        })

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 })
        return uploadUrl
    }
}
