export interface SitemapGeneratorOptions {
    pagesDirectory: string
    exportDirectory: string,
    baseUrl?: string,
    exportFilename?: string,
    changeFreq?: string,
    sitemapPriority?: string,
    locales?: Array<string>,

    isSiteExcludedCallback?: Function
    beforeFinishCallback?: Function
}

export const SitemapGeneratorDefaultOptions: SitemapGeneratorOptions = {
    pagesDirectory: './pages',
    exportDirectory: './public',
    baseUrl: 'https://www.example.org/',
    exportFilename: 'sitemap.xml',
    changeFreq: 'weekly',
    sitemapPriority: '1.0'
}
