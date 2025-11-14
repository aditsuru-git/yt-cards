import fetch from "node-fetch";

export async function fetchThumbnail(videoId: string): Promise<Buffer> {
	const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

	const rawThumb = await fetch(thumbUrl);

	// Check for a bad HTTP status (e.g., 404 if the video ID is invalid)
	if (!rawThumb.ok) {
		const error = new Error(`Failed to fetch thumbnail for video ID: ${videoId}. Status: ${rawThumb.status}`);
		(error as any).statusCode = rawThumb.status === 404 ? 404 : 502; // 502 for bad gateway/upstream error
		throw error;
	}

	const thumbBuffer = Buffer.from(await rawThumb.arrayBuffer());

	// Check if the buffer is empty
	if (thumbBuffer.length === 0) {
		const error = new Error(`Received empty image buffer for video ID: ${videoId}.`);
		(error as any).statusCode = 500;
		throw error;
	}

	return thumbBuffer;
}
