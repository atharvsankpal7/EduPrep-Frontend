import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/dashboard/',
                '/tests/*/execute',
                '/student/',
            ],
        },
        sitemap: 'https://www.eduprep.app/sitemap.xml',
    };
}
