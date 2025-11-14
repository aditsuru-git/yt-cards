import * as fs from "fs";
import path from "path";

const ASSET_CACHE: Record<string, Buffer> = {};

export function initAssets() {
	const assetsDir = path.join(__dirname, "..", "assets");

	ASSET_CACHE["pfp.png"] = fs.readFileSync(path.join(assetsDir, "pfp.png"));
	ASSET_CACHE["yt_logo_full_light.png"] = fs.readFileSync(path.join(assetsDir, "yt_logo_full_light.png"));
	ASSET_CACHE["yt_logo_full_dark.png"] = fs.readFileSync(path.join(assetsDir, "yt_logo_full_dark.png"));

	console.log("✔ Assets loaded into memory");
}

export function getAsset(fileName: string): Buffer {
	const asset = ASSET_CACHE[fileName];
	if (!asset) {
		throw new Error(`Asset not found: ${fileName}`);
	}
	return asset;
}
