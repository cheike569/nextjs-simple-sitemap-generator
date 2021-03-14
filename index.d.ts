import { SitemapGeneratorDefaultOptions, SitemapGeneratorOptions } from "./interfaces/SitemapGeneratorOptions.js";
interface SitemapGenerator {
    defaultOptions: SitemapGeneratorOptions;
    onPageCollectionFinished?: Function;
    options: SitemapGeneratorOptions;
    generate: Function;
}
declare const SitemapGenerator: new (options: SitemapGeneratorOptions) => SitemapGenerator;
export { SitemapGeneratorDefaultOptions, SitemapGeneratorOptions, SitemapGenerator };
