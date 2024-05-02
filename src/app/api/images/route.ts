import { S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";

const Bucket = process.env.AWS_BUCKET_NAME as string;
const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
	}
});

const processData = (response: any) => {
	const data = response.map((item: { Key: string }) => {
		const tag = item.Key?.split("/")[0];
		const src = `https://${Bucket}.s3.amazonaws.com/${item.Key}`;
		const alt = item.Key?.split("/")[1];
		const name = item.Key?.split("/")[1];
		return { tag, src, alt, name };
	});
	return data;
};

export async function GET(request: NextRequest) {
	const type = request.nextUrl.searchParams.get("type");
	const allowedImagePrefixes = ["editor", "poster", "blog"];
	let response;
	if (type === "images") {
		response = await Promise.all(
			allowedImagePrefixes.map(async prefix => {
				const data = await s3.send(new ListObjectsCommand({ Bucket, Prefix: prefix }));
				return data.Contents;
			})
		);
		response = response.flat();
	} else {
		response = await s3.send(new ListObjectsCommand({ Bucket }));
		response = response.Contents;
	}
	return NextResponse.json({ statusCode: 200, result: processData(response) });
}

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
