import { readFile, writeFile } from "@gluestack/helpers";

interface IText {
	source: string;
	replace: string;
}

// Replaces file's content with the given database name
const reWriteFile = async (filePath: string, texts: IText[]) => {
	return new Promise(async (resolve, reject) => {
		try {
			let data = await readFile(filePath, "utf8");
			for (const text of texts) {
				data = data.replaceAll(text.source, text.replace);
			} 

			await writeFile(filePath, data);
			resolve('done');
		} catch (err) {
			reject(err)
		}
	})
}

export default reWriteFile
