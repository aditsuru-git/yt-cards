import sharp from "sharp";
import { THUMB_CARD } from "@/constants";
import { generateTextSVG, truncateText } from "@/utils";

const {
	CARD_WIDTH,
	CARD_HEIGHT,
	PFP_SIZE,
	PLAY_BUTTON_SIZE,
	PFP_TITLE_PADDING,
	OVERLAY_OPACITY,
	PFP_X_OFFSET,
	PFP_Y_OFFSET,
	TITLE_Y_OFFSET,
	TEXT_FONT_SIZE,
	MAX_TITLE_LENGTH,
} = THUMB_CARD;

export async function generateBigThumbCard(
	title: string,
	pfpBuffer: Buffer,
	playButtonBuffer: Buffer,
	thumbnailBuffer: Buffer,
	titleTheme?: "dark" | string
): Promise<Buffer> {
	const resizedPlayButton = await sharp(playButtonBuffer)
		.resize(PLAY_BUTTON_SIZE, PLAY_BUTTON_SIZE, {
			fit: "contain",
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.toBuffer();

	const circularPfp = await sharp(pfpBuffer).resize(PFP_SIZE, PFP_SIZE).png({ quality: 100 }).toBuffer();

	const darkOverlaySvg = Buffer.from(
		`<svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}"><rect width="100%" height="100%" fill="black" opacity="${OVERLAY_OPACITY}"/></svg>`
	);

	const titleColor = titleTheme === "dark" ? "#242424" : "#ffffff";
	const titleText = truncateText(title, MAX_TITLE_LENGTH);
	const titleSvgBuffer = generateTextSVG({
		width: CARD_WIDTH - PFP_SIZE - PFP_X_OFFSET - 100,
		height: 40,
		text: titleText,
		fontSize: TEXT_FONT_SIZE,

		color: titleColor,
		shadow:
			titleTheme === "dark"
				? undefined
				: {
						offsetX: 2,
						offsetY: 2,
						blur: 4,
						color: "rgba(0,0,0,0.5)",
				  },
	});

	const TITLE_LEFT_POSITION = PFP_X_OFFSET + PFP_SIZE + PFP_TITLE_PADDING;

	const background = sharp(thumbnailBuffer)
		.resize(CARD_WIDTH, CARD_HEIGHT, { fit: "cover" })
		.composite([
			{
				input: darkOverlaySvg,
				left: 0,
				top: 0,
			},
		]);

	const finalBuffer = await background
		.composite([
			{
				input: circularPfp,
				left: PFP_X_OFFSET,
				top: PFP_Y_OFFSET,
			},
			{
				input: titleSvgBuffer,
				left: TITLE_LEFT_POSITION,
				top: TITLE_Y_OFFSET,
			},
			{
				input: resizedPlayButton,
				gravity: "center",
			},
		])
		.jpeg({ quality: 95 })
		.toBuffer();

	return finalBuffer;
}
