import { readFileSync } from 'fs';
import parseMD from 'parse-md';
import path from 'path';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const articlesDir = path.join(process.cwd(), `src/articles/${params.slug}.md`);
	let fileContents =readFileSync(articlesDir, 'utf-8');
    const { metadata, content } = parseMD(fileContents);
    return {
        metadata,
        content
    }
}
