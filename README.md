# nextjs-simple-sitemap-generator

A simple but working sitemap generator for NextJS Projects.

## Installation

    npm install nextjs-simple-sitemap-generator

## Usage

You can theoretically use the sitemap generator at any given place of your application. I reccomend you create a `sitemap.js` file in your root directory, that you execute while building your application.

    // sitemap.js
    const sitemapOptions: SitemapGeneratorOptions = {
        pagesDirectory: './test/pages',
        exportDirectory: './test/export',
        baseUrl: 'https://www.example.org',
        exportFilename: 'sitemap.xml'
    }

    const sitemapGenerator = new SitemapGenerator(testOptions);
    
    // Execute generation
    sitemapGenerator.generate();
    
    console.log("🎉 Sitemap generated!")




## Options

    interface SitemapGeneratorOptions {
        pagesDirectory?: string
        exportDirectory?: string,
        baseUrl?: string,
        exportFilename?: string,
        changeFreq?: string,
        sitemapPriority?: string

        isSiteExcludedCallback?: Function
        beforeFinishCallback?: Function
    }

Default Options:

    {
        pagesDirectory: './pages',
        exportDirectory: './public',
        baseUrl: 'https://www.example.org/',
        exportFilename: 'sitemap.xml',
        changeFreq: 'weekly',
        sitemapPriority: '1.0'
    }

## Annotations

Annotations can be used to set options for specific pages.

Available Annotations are:

`// @sitemapExcluded` - Excludes a Sitemap

`// @changeFreq daily` - Sets changefreq value

`// @sitemapPriority 0.5` - Sets priority value


For example

    // pages/admin.tsx
    // @sitemapExcluded

    export default () => {
        return <>Secret admin page</>
    }


