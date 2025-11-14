import fetch from "node-fetch";

export async function fetchThumbnail(videoId: string) {
	const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

	const rawThumb = await fetch(thumbUrl);
	const thumbBuffer = Buffer.from(await rawThumb.arrayBuffer());
	return thumbBuffer;
}
