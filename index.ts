import {SitemapGeneratorDefaultOptions, SitemapGeneratorOptions} from "./interfaces/SitemapGeneratorOptions";

import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';

export interface PageProps {
    sitemapPriority?: string
    changeFreq?: string,
    isExcluded?: boolean
}

class SitemapGenerator {
    defaultOptions: SitemapGeneratorOptions
    onPageCollectionFinished?: Function
    options: SitemapGeneratorOptions

    constructor(options: SitemapGeneratorOptions) {
        this.defaultOptions = SitemapGeneratorDefaultOptions;

        this.options = {...this.defaultOptions, ...options};

        // @ts-ignore
        this.options.baseUrl = this.options.baseUrl.replace(/\/$/, '');
        // @ts-ignore
        this.options.exportDirectory = this.options.exportDirectory.replace(/\/$/, '');
        // @ts-ignore
        this.options.pagesDirectory = this.options.pagesDirectory.replace(/\/$/, '');
    }

    dirExists(dir: string) {
        fs.access(dir, function (error: any) {
            if (error) {
                throw error;
            }
        })
    }

    ensureWriteDirectoryExists(dir: string) {
        const dirname = path.dirname(dir);
        if (fs.existsSync(dirname)) {
            return true;
        }

        this.ensureWriteDirectoryExists(dirname);
        fs.mkdirSync(dirname);
    }

    isExcluded(file: string) {
        if (
            file.indexOf(".tsx") === -1 &&
            file.indexOf(".js") === -1 &&
            file.indexOf(".ts") === -1
        ) {
            return true;
        }

        if (
            file.indexOf("403") !== -1 ||
            file.indexOf("404") !== -1 ||
            file.indexOf("500") !== -1 ||
            file.indexOf("503") !== -1
        ) {
            return true;

        }

        if (file.substr(0, 1).indexOf("_") !== -1) {
            return true;
        }

        return false;
    }

    pageOptions(path: string): PageProps {
        const content = fs.readFileSync(path, {encoding: 'utf8', flag: 'r'});

        let pageProps: PageProps = {
            sitemapPriority: '',
            changeFreq: '',
            isExcluded: false
        };

        if (content) {
            let hasChangeFreq = content.match(/@changeFreq (\w+)/);
            if (hasChangeFreq && hasChangeFreq.index !== -1) {
                pageProps.changeFreq = hasChangeFreq[1];
            }

            let hasSitemapPriority = content.match(/@sitemapPriority ([0-9\.]+)/);
            if (hasSitemapPriority && hasSitemapPriority.index !== -1) {
                pageProps.sitemapPriority = hasSitemapPriority[1];
            }

            let excluded = content.match(/@sitemapExcluded/);
            if (excluded && excluded.index !== -1) {
                pageProps.isExcluded = true;
            }
        }

        return pageProps;
    }

    generatePages() {
        const files = fs.readdirSync(this.options.pagesDirectory);

        let xmlContent = ``;

        const dateObj = new Date();
        const month = dateObj.getUTCMonth() + 1;
        const day = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();

        const currentDate = `${year}-${month}-${day}`;

        files.forEach((file: string) => {
            const fullPath = `${this.options.pagesDirectory}/${file}`;

            if (this.isExcluded(file)) {
                return;
            }

            if (typeof this.options.isSiteExcludedCallback == "function") {
                if (this.options.isSiteExcludedCallback(file)) {
                    return;
                }
            }

            let trimmedFilename = file.split('.').slice(0, -1).join('.');

            const pageOptions = this.pageOptions(fullPath)

            if (pageOptions.isExcluded) {
                return;
            }

            if(trimmedFilename === "index") {
                trimmedFilename = "";
            }

            if(this.options.locales && this.options.locales.length > 0) {
                this.options.locales.forEach(locale => {
                    xmlContent += `<url>
  <loc>${this.options.baseUrl}/${locale}/${trimmedFilename}</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>${(pageOptions.changeFreq ? pageOptions.changeFreq : this.options.changeFreq)}</changefreq>
  <priority>${(pageOptions.sitemapPriority ? pageOptions.sitemapPriority : this.options.sitemapPriority)}</priority>
 </url>`;
                })
            } else {
                xmlContent += `<url>
  <loc>${this.options.baseUrl}/${trimmedFilename}</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>${(pageOptions.changeFreq ? pageOptions.changeFreq : this.options.changeFreq)}</changefreq>
  <priority>${(pageOptions.sitemapPriority ? pageOptions.sitemapPriority : this.options.sitemapPriority)}</priority>
 </url>`;
            }

        });

        return xmlContent;
    }

    async generate() {
        this.dirExists(this.options.pagesDirectory);

        const exportFile = `${this.options.exportDirectory}/${this.options.exportFilename}`

        let exportContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="https://www.sitemaps.org/schemas/sitemap/0.9 https://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

        exportContent += this.generatePages();

        if (typeof this.options.beforeFinishCallback == "function") {
            exportContent += await this.options.beforeFinishCallback();
        }

        exportContent += '</urlset>';

        fse.outputFile(exportFile, exportContent, function (err: any) {
            if (err) {
                throw err;
            }

            console.log("The file was saved!");
        });
    }
}

export default SitemapGenerator;
