interface IText {
    source: string;
    replace: string;
}
declare const reWriteFile: (filePath: string, texts: IText[]) => Promise<unknown>;
export default reWriteFile;
