import {expect, assert} from 'chai';
import SitemapGenerator from "../index";
import {SitemapGeneratorOptions} from "../interfaces/SitemapGeneratorOptions"

import * as fs from "fs";
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
 import 'mocha';

const testOptions: SitemapGeneratorOptions = {
    pagesDirectory: './test/pages',
    exportDirectory: './test/export',
    baseUrl: 'https://www.example.org',
    exportFilename: 'sitemap.xml',
    locales: ['de', 'en']
}

const testInstance = new SitemapGenerator(testOptions);


describe('Generate function exists', () => {
    it('should return type function', () => {
        expect(typeof testInstance.generate).to.equal("function");
    });

    it('does generate a sitemap', () => {
        testInstance.generate();

        const fullPath = `${testOptions.exportDirectory}/${testOptions.exportFilename}`;
        expect(fs.existsSync(fullPath)).to.equal(true);

        const content = fs.readFileSync(fullPath, {encoding:'utf8', flag:'r'});

        expect(content.match(/admin/)).to.be.null;
        expect(content.match(/_document/)).to.be.null;
        expect(content.match(/404/)).to.be.null;

        expect(content.indexOf("https://www.example.org/home")).not.to.equal(-1)
        expect(content.indexOf("https://www.example.org/blog")).not.to.equal(-1)
    });
});

export default testInstance;
