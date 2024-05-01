import { S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const Bucket = process.env.AWS_BUCKET_NAME as string;
const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
	}
});

export async function POST(request: Request) {
	const formData = await request.formData();
	const files = formData.getAll("image") as File[];
	const type = formData.get("type") as string;

	const response = await Promise.all(
		files.map(async file => {
			const Body = (await file.arrayBuffer()) as Buffer;
			try {
				s3.send(
					new PutObjectCommand({
						Bucket,
						Key: `${type}/${file.name}`,
						Body,
						ACL: "public-read",
						ContentType: file.type,
						Metadata: {
							"Content-Type": file.type
						}
					})
				);
				const imageURI = `https://${Bucket}.s3.amazonaws.com/${type}/${file.name}`;
				return imageURI;
			} catch (error) {
				console.error(error);
			}
		})
	);

	return NextResponse.json(response);
}
