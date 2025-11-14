import { asyncHandler, fetchThumbnail } from "@/utils";
import { generateBigThumbCard } from "@/cards";
import { getAsset } from "@/utils";
interface BigThumbCardParams {
	id: string;
}

interface BigThumbCardData {
	titleTheme: string;
	logoTheme: string;
}

export const getThumbCard = asyncHandler<{ params: BigThumbCardParams; reqQuery: BigThumbCardData }>(
	async (req, res) => {
		const videoId = req.params.id;
		const titleTheme = req.query.titleTheme === "dark" ? "dark" : "light";
		const logoTheme = req.query.logoTheme === "dark" ? "dark" : "light";

		const thumbnailBuffer = await fetchThumbnail(videoId);
		const pfpBuffer = getAsset("pfp.png");

		const playButtonBuffer = getAsset(`yt_logo_full_${logoTheme}.png`);

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
