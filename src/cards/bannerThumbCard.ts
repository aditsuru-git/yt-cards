import sharp from "sharp";
import { generateTextSVG } from "@/utils";
import { BANNER_THUMB_CARD } from "@/constants";

interface BannerThumbCardOptions {
	videoId: string;
	title: string;
	channelName: string;
	channelPfpBuffer: Buffer;
	thumbnailBuffer: Buffer;
	views: string;
	uploadDate: string;
	duration: string;
	description?: string;
	isVerified?: boolean;
	theme?: "light" | "dark";
}

/**
 * Formats view count to YouTube-style format
 * @example formatViews(574000) => "574K"
 */
function formatViews(views: number | string): string {
	const num = typeof views === "string" ? parseInt(views, 10) : views;
	if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
	if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
	return num.toString();
}

/**
 * Truncates text with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength - 3) + "...";
}

/**
 * Creates a rounded rectangle badge for duration
 */
function createTimeBadge(duration: string, width: number, height: number, theme: "light" | "dark"): Buffer {
	const colors = BANNER_THUMB_CARD[theme.toUpperCase() as "LIGHT" | "DARK"];
	const textWidth = duration.length * 8 + BANNER_THUMB_CARD.TIME_BADGE_PADDING * 2;
	const badgeX = width - textWidth - BANNER_THUMB_CARD.TIME_BADGE_RIGHT_OFFSET;
	const badgeY = height - BANNER_THUMB_CARD.TIME_BADGE_HEIGHT - BANNER_THUMB_CARD.TIME_BADGE_BOTTOM_OFFSET;

	const svg = `
		<svg width="${width}" height="${height}">
			<rect 
				x="${badgeX}" 
				y="${badgeY}" 
				width="${textWidth}" 
				height="${BANNER_THUMB_CARD.TIME_BADGE_HEIGHT}" 
				rx="${BANNER_THUMB_CARD.TIME_BADGE_BORDER_RADIUS}" 
				fill="${colors.TIME_BADGE_BG}"
			/>
			<text 
				x="${badgeX + BANNER_THUMB_CARD.TIME_BADGE_PADDING}" 
				y="${badgeY + BANNER_THUMB_CARD.TIME_BADGE_HEIGHT / 2}" 
				dominant-baseline="middle" 
				fill="${colors.TIME_BADGE_TEXT}" 
				font-family="Roboto, Arial, sans-serif" 
				font-size="12" 
				font-weight="500"
			>${duration}</text>
		</svg>
	`;

	return Buffer.from(svg);
}

/**
 * Creates verification badge SVG
 */
function createVerificationBadge(theme: "light" | "dark"): Buffer {
	const colors = BANNER_THUMB_CARD[theme.toUpperCase() as "LIGHT" | "DARK"];
	const size = BANNER_THUMB_CARD.VERIFICATION_BADGE_SIZE;

	const svg = `
		<svg width="${size}" height="${size}" viewBox="0 0 14 14">
			<circle cx="7" cy="7" r="7" fill="${colors.META_COLOR}"/>
			<path 
				d="M5.5 7l1.5 1.5L10 5.5" 
				stroke="white" 
				stroke-width="1.5" 
				fill="none" 
				stroke-linecap="round" 
				stroke-linejoin="round"
			/>
		</svg>
	`;
	return Buffer.from(svg);
}

/**
 * Generates a banner-style YouTube thumbnail card
 * This matches the YouTube horizontal video card layout
 */
export async function generateBannerThumbCard(options: BannerThumbCardOptions): Promise<Buffer> {
	const {
		title,
		channelName,
		channelPfpBuffer,
		thumbnailBuffer,
		views,
		uploadDate,
		duration,
		description = "",
		isVerified = false,
		theme = "light",
	} = options;

	const colors = BANNER_THUMB_CARD[theme.toUpperCase() as "LIGHT" | "DARK"];

	// Process thumbnail with rounded corners and duration badge
	const resizedThumbnail = await sharp(thumbnailBuffer)
		.resize(BANNER_THUMB_CARD.THUMBNAIL_WIDTH, BANNER_THUMB_CARD.THUMBNAIL_HEIGHT, { fit: "cover" })
		.toBuffer();

	// Create rounded corners for thumbnail
	const roundedThumbnail = await sharp(resizedThumbnail)
		.composite([
			{
				input: Buffer.from(`
					<svg width="${BANNER_THUMB_CARD.THUMBNAIL_WIDTH}" height="${BANNER_THUMB_CARD.THUMBNAIL_HEIGHT}">
						<rect 
							width="${BANNER_THUMB_CARD.THUMBNAIL_WIDTH}" 
							height="${BANNER_THUMB_CARD.THUMBNAIL_HEIGHT}" 
							rx="${BANNER_THUMB_CARD.THUMBNAIL_BORDER_RADIUS}" 
							fill="white"
						/>
					</svg>
				`),
				blend: "dest-in",
			},
		])
		.toBuffer();

	const timeBadge = createTimeBadge(
		duration,
		BANNER_THUMB_CARD.THUMBNAIL_WIDTH,
		BANNER_THUMB_CARD.THUMBNAIL_HEIGHT,
		theme
	);

	const thumbnailWithBadge = await sharp(roundedThumbnail)
		.composite([{ input: timeBadge, top: 0, left: 0 }])
		.toBuffer();

	// Process channel PFP to circular
	const circularPfp = await sharp(channelPfpBuffer)
		.resize(BANNER_THUMB_CARD.PFP_SIZE, BANNER_THUMB_CARD.PFP_SIZE)
		.png({ quality: 100 })
		.toBuffer();

	// Prepare text content
	const truncatedTitle = truncateText(title, BANNER_THUMB_CARD.TITLE_MAX_LENGTH);
	const formattedViews = typeof views === "number" ? formatViews(views) : views;
	const metaText = `${formattedViews} views • ${uploadDate}`;
	const truncatedDesc = description ? truncateText(description, BANNER_THUMB_CARD.DESC_MAX_LENGTH) : "";

	// Calculate content width
	const contentWidth =
		BANNER_THUMB_CARD.CARD_WIDTH - BANNER_THUMB_CARD.CONTENT_LEFT_MARGIN - BANNER_THUMB_CARD.CONTENT_RIGHT_PADDING;

	// Generate text SVGs
	const titleSvg = generateTextSVG({
		width: contentWidth,
		height: BANNER_THUMB_CARD.LINE_HEIGHT * 2,
		text: truncatedTitle,
		fontSize: BANNER_THUMB_CARD.TITLE_FONT_SIZE,
		color: colors.TITLE_COLOR,
		fontWeight: BANNER_THUMB_CARD.TITLE_FONT_WEIGHT,
		y: 50,
	});

	// Channel name
	const channelLineY = BANNER_THUMB_CARD.CONTENT_TOP_MARGIN + BANNER_THUMB_CARD.LINE_HEIGHT * 2 + 4;
	const channelTextX =
		BANNER_THUMB_CARD.CONTENT_LEFT_MARGIN + BANNER_THUMB_CARD.PFP_SIZE + BANNER_THUMB_CARD.PFP_TO_TEXT_GAP;

	const channelNameSvg = generateTextSVG({
		width: 200,
		height: BANNER_THUMB_CARD.LINE_HEIGHT,
		text: channelName,
		fontSize: BANNER_THUMB_CARD.META_FONT_SIZE,
		color: colors.META_COLOR,
		fontWeight: BANNER_THUMB_CARD.META_FONT_WEIGHT,
		x: 0,
		y: 50,
	});

	// Meta info (views, date)
	const metaSvg = generateTextSVG({
		width: contentWidth,
		height: BANNER_THUMB_CARD.LINE_HEIGHT,
		text: metaText,
		fontSize: BANNER_THUMB_CARD.META_FONT_SIZE,
		color: colors.META_COLOR,
		fontWeight: BANNER_THUMB_CARD.META_FONT_WEIGHT,
		x: 0,
		y: 50,
	});

	// Description
	const descSvg = truncatedDesc
		? generateTextSVG({
				width: contentWidth,
				height: BANNER_THUMB_CARD.LINE_HEIGHT,
				text: truncatedDesc,
				fontSize: BANNER_THUMB_CARD.DESC_FONT_SIZE,
				color: colors.DESC_COLOR,
				fontWeight: BANNER_THUMB_CARD.DESC_FONT_WEIGHT,
				x: 0,
				y: 50,
		  })
		: null;

	// Create background canvas
	const background = sharp({
		create: {
			width: BANNER_THUMB_CARD.CARD_WIDTH,
			height: BANNER_THUMB_CARD.CARD_HEIGHT,
			channels: 4,
			background: colors.BG_COLOR,
		},
	});

	// Composite all elements
	const compositeElements: sharp.OverlayOptions[] = [
		// Thumbnail with duration badge
		{ input: thumbnailWithBadge, left: 0, top: 0 },

		// Title
		{ input: titleSvg, left: BANNER_THUMB_CARD.CONTENT_LEFT_MARGIN, top: BANNER_THUMB_CARD.CONTENT_TOP_MARGIN },

		// Channel PFP
		{ input: circularPfp, left: BANNER_THUMB_CARD.CONTENT_LEFT_MARGIN, top: channelLineY },

		// Channel name
		{ input: channelNameSvg, left: channelTextX, top: channelLineY },
	];

	// Add verification badge if verified
	if (isVerified) {
		const verificationBadge = createVerificationBadge(theme);
		compositeElements.push({
			input: verificationBadge,
			left: channelTextX + channelName.length * 8 + 4,
			top: channelLineY + 5,
		});
	}

	// Add meta info
	compositeElements.push({
		input: metaSvg,
		left: channelTextX,
		top: channelLineY + BANNER_THUMB_CARD.LINE_HEIGHT + 2,
	});

	// Add description if present
	if (descSvg) {
		compositeElements.push({
			input: descSvg,
			left: BANNER_THUMB_CARD.CONTENT_LEFT_MARGIN,
			top: channelLineY + BANNER_THUMB_CARD.LINE_HEIGHT * 2 + 8,
		});
	}

	const finalBuffer = await background.composite(compositeElements).jpeg({ quality: 95 }).toBuffer();

	return finalBuffer;
}

export type { BannerThumbCardOptions };
