import fetch from "node-fetch";
import { ApiError } from "@/utils/ApiError";

export async function fetchThumbnail(videoId: string): Promise<Buffer> {
	const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

	const rawThumb = await fetch(thumbUrl);

	if (!rawThumb.ok) {
		throw new ApiError(`Failed to fetch thumbnail for video ID: ${videoId}`, rawThumb.status === 404 ? 404 : 502);
	}

	const thumbBuffer = Buffer.from(await rawThumb.arrayBuffer());

	if (thumbBuffer.length === 0) {
		throw new ApiError(`Received empty image buffer for video ID: ${videoId}`, 500);
	}

	return thumbBuffer;
}
