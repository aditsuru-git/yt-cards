export type TextFontWeight = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";

export const THUMB_CARD: {
	CARD_WIDTH: number;
	CARD_HEIGHT: number;
	PFP_SIZE: number;
	PLAY_BUTTON_SIZE: number;
	PFP_TITLE_PADDING: number;
	OVERLAY_OPACITY: number;
	PFP_X_OFFSET: number;
	PFP_Y_OFFSET: number;
	TITLE_Y_OFFSET: number;
	TEXT_FONT_SIZE: number;
	TEXT_COLOR: string;
	TEXT_FONT_FAMILY: string;
	TEXT_FONT_WEIGHT: TextFontWeight;
	MAX_TITLE_LENGTH: number;
} = {
	CARD_WIDTH: 1280,
	CARD_HEIGHT: 720,
	PFP_SIZE: 50,
	PLAY_BUTTON_SIZE: 450,
	PFP_TITLE_PADDING: 15,
	OVERLAY_OPACITY: 0.3,
	PFP_X_OFFSET: 20,
	PFP_Y_OFFSET: 20,
	TITLE_Y_OFFSET: 25,
	TEXT_FONT_SIZE: 28,
	TEXT_COLOR: "#FFFFFF",
	TEXT_FONT_FAMILY: "Roboto, sans-serif",
	TEXT_FONT_WEIGHT: "normal",
	MAX_TITLE_LENGTH: 70,
};
