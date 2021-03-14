import { SitemapGeneratorOptions } from "./interfaces/SitemapGeneratorOptions";
export interface PageProps {
    sitemapPriority?: string;
    changeFreq?: string;
    isExcluded?: boolean;
}
declare class SitemapGenerator {
    defaultOptions: SitemapGeneratorOptions;
    onPageCollectionFinished?: Function;
    options: SitemapGeneratorOptions;
    constructor(options: SitemapGeneratorOptions);
    dirExists(dir: string): void;
    ensureWriteDirectoryExists(dir: string): true | undefined;
    isExcluded(file: string): boolean;
    pageOptions(path: string): PageProps;
    generatePages(): string;
    generate(): Promise<void>;
}
export default SitemapGenerator;
