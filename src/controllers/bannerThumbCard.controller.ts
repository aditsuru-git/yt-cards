import { asyncHandler, fetchThumbnail, getAsset } from "@/utils";
import { generateBannerThumbCard, BannerThumbCardOptions } from "@/cards/bannerThumbCard";

interface BannerThumbCardParams {
	id: string;
}

interface BannerThumbCardQuery {
	theme?: "light" | "dark";
}

export const getBannerThumbCard = asyncHandler<{
	params: BannerThumbCardParams;
	reqQuery: BannerThumbCardQuery;
}>(async (req, res) => {
	const videoId = req.params.id;
	const theme = req.query.theme === "dark" ? "dark" : "light";

	const thumbnailBuffer = await fetchThumbnail(videoId);
	const channelPfpBuffer = getAsset("pfp.png");

	const cardOptions: BannerThumbCardOptions = {
		videoId,
		title: "Game Development for Dummies | The Ultimate Guide",
		channelName: "Thomas Brush",
		channelPfpBuffer,
		thumbnailBuffer,
		views: "574K",
		uploadDate: "2 years ago",
		duration: "12:28",
		description:
			"Learn how to make money from your indie games (free webinar): https://www.fulltimegamedev.com/opt-in-how-to-make-six-figures...",
		isVerified: true,
		theme,
	};

	const cardBuffer = await generateBannerThumbCard(cardOptions);

	res.set("Content-Type", "image/jpeg");
	// res.set("Cache-Control", "public, max-age=3600");
	res.send(cardBuffer);
});
