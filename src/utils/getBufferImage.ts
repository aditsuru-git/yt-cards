import * as fs from "fs";
import path from "path";

export function loadAsset(fileName: string): Buffer {
	const assetPath = path.join(__dirname, "..", "assets", fileName);
	return fs.readFileSync(assetPath);
}
