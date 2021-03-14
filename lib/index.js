"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SitemapGeneratorOptions_1 = require("./interfaces/SitemapGeneratorOptions");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
class SitemapGenerator {
    constructor(options) {
        this.defaultOptions = SitemapGeneratorOptions_1.SitemapGeneratorDefaultOptions;
        this.options = Object.assign(Object.assign({}, this.defaultOptions), options);
        // @ts-ignore
        this.options.baseUrl = this.options.baseUrl.replace(/\/$/, '');
        // @ts-ignore
        this.options.exportDirectory = this.options.exportDirectory.replace(/\/$/, '');
        // @ts-ignore
        this.options.pagesDirectory = this.options.pagesDirectory.replace(/\/$/, '');
    }
    dirExists(dir) {
        fs_1.default.access(dir, function (error) {
            if (error) {
                throw error;
            }
        });
    }
    ensureWriteDirectoryExists(dir) {
        const dirname = path_1.default.dirname(dir);
        if (fs_1.default.existsSync(dirname)) {
            return true;
        }
        this.ensureWriteDirectoryExists(dirname);
        fs_1.default.mkdirSync(dirname);
    }
    isExcluded(file) {
        if (file.indexOf(".tsx") === -1 &&
            file.indexOf(".js") === -1 &&
            file.indexOf(".ts") === -1) {
            return true;
        }
        if (file.indexOf("403") !== -1 ||
            file.indexOf("404") !== -1 ||
            file.indexOf("500") !== -1 ||
            file.indexOf("503") !== -1) {
            return true;
        }
        if (file.substr(0, 1).indexOf("_") !== -1) {
            return true;
        }
        return false;
    }
    pageOptions(path) {
        const content = fs_1.default.readFileSync(path, { encoding: 'utf8', flag: 'r' });
        let pageProps = {
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
        const files = fs_1.default.readdirSync(this.options.pagesDirectory);
        let xmlContent = ``;
        const dateObj = new Date();
        const month = dateObj.getUTCMonth() + 1;
        const day = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();
        const currentDate = `${year}-${month}-${day}`;
        files.forEach((file) => {
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
            const pageOptions = this.pageOptions(fullPath);
            if (pageOptions.isExcluded) {
                return;
            }
            xmlContent += `<url>
  <loc>${this.options.baseUrl}/${trimmedFilename}</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>${(pageOptions.changeFreq ? pageOptions.changeFreq : this.options.changeFreq)}</changefreq>
  <priority>${(pageOptions.sitemapPriority ? pageOptions.sitemapPriority : this.options.sitemapPriority)}</priority>
 </url>`;
        });
        return xmlContent;
    }
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dirExists(this.options.pagesDirectory);
            const exportFile = `${this.options.exportDirectory}/${this.options.exportFilename}`;
            let exportContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="https://www.sitemaps.org/schemas/sitemap/0.9 https://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
            exportContent += this.generatePages();
            if (typeof this.options.beforeFinishCallback == "function") {
                exportContent += yield this.options.beforeFinishCallback();
            }
            exportContent += '</urlset>';
            fs_extra_1.default.outputFile(exportFile, exportContent, function (err) {
                if (err) {
                    throw err;
                }
                console.log("The file was saved!");
            });
        });
    }
}
exports.default = SitemapGenerator;
