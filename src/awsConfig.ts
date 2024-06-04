import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({});

const bucketName = "projetosteste-herik";

async function uploadFiles(
    fileName,
    fileContent: Express.Multer.File,
): Promise<void> {
    const params = {
        Bucket: bucketName,
        Key: `${Date.now()}_${fileName}`,
        Body: fileContent.buffer,
    };

    try {
        const data = await s3.upload(params).promise();

        console.log(`Arquivo carregado com sucesso. URL: ${data.Location}`);
    } catch (err) {
        console.log(err);
    }
}

export { uploadFiles };
