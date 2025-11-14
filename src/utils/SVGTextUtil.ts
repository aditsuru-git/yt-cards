import { TEXT_FONT_SIZE, TEXT_COLOR, TEXT_FONT_FAMILY, TEXT_FONT_WEIGHT } from "@/constants";

export function escapeXml(unsafe: string): string {
	return unsafe.replace(/[<>&'"]/g, function (c) {
		switch (c) {
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case "&":
				return "&amp;";
			case "'":
				return "&apos;";
			case '"':
				return "&quot;";
			default:
				return c;
		}
	});
}

interface GenerateTextSVGParams {
	width: number;
	height: number;
	text: string;
	fontSize?: number;
	color?: string;
	fontWeight?: string;
	fontFamily?: string;
	x?: number;
	y?: number;
	dominantBaseline?:
		| "auto"
		| "text-bottom"
		| "alphabetic"
		| "ideographic"
		| "middle"
		| "central"
		| "mathematical"
		| "hanging"
		| "text-top";
	shadow?: {
		offsetX: 2;
		offsetY: 2;
		blur: 4;
		color: "rgba(0,0,0,0.5)";
	};
}

export function generateTextSVG({
	width,
	height,
	text,
	fontSize = TEXT_FONT_SIZE,
	color = TEXT_COLOR,
	fontWeight = TEXT_FONT_WEIGHT,
	fontFamily = TEXT_FONT_FAMILY,
	x = 0,
	y = 50,
	dominantBaseline = "middle",
	shadow,
}: GenerateTextSVGParams): Buffer {
	const dropShadow = shadow
		? `filter: drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.color});`
		: "";

	const encodedText = escapeXml(text);
	const svg = `
        <svg width="${width}" height="${height}">
            <style>
                .text-style { 
                    fill: ${color}; 
                    font-size: ${fontSize}px; 
                    font-family: ${fontFamily}; 
                    font-weight: ${fontWeight}; 
					${dropShadow}}
                }
            </style>
            <text x="${x}" y="${y}%" dominant-baseline="${dominantBaseline}" class="text-style">${encodedText}</text>
        </svg>
    `;

	return Buffer.from(svg);
}
