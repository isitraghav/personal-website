import fs, { readdir } from 'fs/promises';
import path from 'path';
import parseMD from 'parse-md';
import { readFileSync } from 'fs';

export async function load({ params }) {
	const articlesDir = path.join('./static/articles');

	const files = await readdir(articlesDir);
	let fileData = [];
	files.forEach((f) => {
		let fileContents = readFileSync(path.join(articlesDir, f), 'utf-8');
		const { metadata, content } = parseMD(fileContents);
		fileData = [...fileData, {...metadata, name: f}];
	});
	return {
		articles: fileData
	};
}
