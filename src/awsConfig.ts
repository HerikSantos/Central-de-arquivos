import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({});

async function uploadFiles(
    fileName,
    fileContent: Express.Multer.File,
): Promise<string | undefined> {
    try {
        const bucketName = "projetosteste-herik";
        const key = `${Date.now()}_${fileName}`;

        const params = {
            Bucket: bucketName,
            Key: key,
            Body: fileContent.buffer,
        };

        await s3.upload(params).promise();

        const generateSignedUrl = (bucketName, key, expires): string => {
            const params = {
                Bucket: bucketName,
                Key: key,
                Expires: expires,
            };

            return s3.getSignedUrl("getObject", params);
        };

        const result = generateSignedUrl(bucketName, key, 60);

        return result;
    } catch (err) {
        console.log(err);
    }
}

export { uploadFiles };
