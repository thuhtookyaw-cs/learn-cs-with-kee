export default function robots() {
    return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/'] }, sitemap: 'https://learn-cs-with-kee.vercel.app/sitemap.xml' };
}
