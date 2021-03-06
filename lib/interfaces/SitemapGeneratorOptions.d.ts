export interface SitemapGeneratorOptions {
    pagesDirectory: string;
    exportDirectory: string;
    baseUrl?: string;
    exportFilename?: string;
    changeFreq?: string;
    sitemapPriority?: string;
    locales?: Array<string>;
    isSiteExcludedCallback?: Function;
    beforeFinishCallback?: Function;
}
export declare const SitemapGeneratorDefaultOptions: SitemapGeneratorOptions;
