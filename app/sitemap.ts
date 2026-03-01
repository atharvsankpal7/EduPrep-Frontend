import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.eduprep.app';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        // Future dynamic routes, such as public topic pages, will be fetched and mapped here conditionally
        // {
        //   url: `${baseUrl}/topics`,
        //   lastModified: new Date(),
        //   changeFrequency: 'daily',
        //   priority: 0.8,
        // }
    ];
}
