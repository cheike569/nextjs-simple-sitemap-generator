# nextjs-simple-sitemap-generator

A simple and easy sitemap generator for NextJS Projects. By Christoph Heike (Webzeile GmbH, www.webzeile.com)

## Installation

    npm install nextjs-simple-sitemap-generator

## Usage

You can theoretically use the sitemap generator at any given place of your application. It's recommend that you create a `sitemap.js` file in your root directory, that you execute while building your application.

    // sitemap.js
    const sitemapOptions: SitemapGeneratorOptions = {
        pagesDirectory: './pages',
        exportDirectory: './public',
        baseUrl: 'https://www.example.org',
        exportFilename: 'sitemap.xml',
        beforeFinishCallback: async function() {
            // Whatever string you return will be inserted before
            // </urlset> closing tag in your sitemap
            return `<url>
                    <loc>https://www.example.org/blog</loc>
                    <lastmod>2021-3-14</lastmod>
                    <changefreq>weekly</changefreq>
                    <priority>1.0</priority>
                </url>`
        }
    }

    const sitemapGenerator = new SitemapGenerator(testOptions);
    
    // Execute generation
    sitemapGenerator.generate();
    
    console.log("🎉 Sitemap generated!")

Then run it

    node sitemap

## Options

    interface SitemapGeneratorOptions {
        pagesDirectory?: string
        exportDirectory?: string,
        baseUrl?: string,
        exportFilename?: string,
        changeFreq?: string,
        sitemapPriority?: string

        isSiteExcludedCallback?: Function // Determine if a site should be excluded function(fileName): boolean
        beforeFinishCallback?: Function // Whatever string you return will be inserted before </urlset> closing tag in your sitemap
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


