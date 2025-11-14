import { asyncHandler, fetchThumbnail } from "@/utils";
import { generateBigThumbCard } from "@/cards";
import { loadAsset } from "@/utils/getBufferImage";
interface BigThumbCardParams {
	id: string;
}

interface BigThumbCardData {
	title: string;
	logo: string;
}

export const getThumbCard = asyncHandler<{ params: BigThumbCardParams; reqQuery: BigThumbCardData }>(
	async (req, res) => {
		const videoId = req.params.id;
		const titleTheme = req.query.title === "dark" ? "dark" : "light";
		const logoTheme = req.query.logo === "dark" ? "dark" : "light";

		const thumbnailBuffer = await fetchThumbnail(videoId);
		const pfpBuffer = loadAsset("pfp.png");

		const playButtonBuffer = loadAsset(`yt_logo_full_${logoTheme}.png`);

		const cardBuffer = await generateBigThumbCard(
			"Welcome to something xyz",
			pfpBuffer,
			playButtonBuffer,
			thumbnailBuffer,
			titleTheme
		);
		res.set("Content-Type", "image/jpeg");
		res.send(cardBuffer);
	}
);
