interface SitemapGeneratorOptions {
    pagesDirectory?: string;
    exportDirectory?: string;
    baseUrl?: string;
    exportFilename?: string;
    changeFreq?: string;
    sitemapPriority?: string;
    isSiteExcludedCallback?: Function;
    beforeFinishCallback?: Function;
}
declare let SitemapGeneratorDefaultOptions: SitemapGeneratorOptions;
export { SitemapGeneratorDefaultOptions, SitemapGeneratorOptions };
