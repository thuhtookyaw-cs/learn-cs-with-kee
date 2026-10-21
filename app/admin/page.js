import Image from 'next/image';
import { cookies } from 'next/headers';
import { adminConfigured, validSession } from '@/lib/admin-auth';
import { analyticsOverview, articleList, storeProducts } from '@/lib/admin-data';
import AdminWorkspace from './workspace';
import './admin.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function AdminPage({ searchParams }) {
  const cookie = (await cookies()).get('kee_admin')?.value;
  const loggedIn = validSession(cookie);
  const params = await searchParams;
  if (!loggedIn) return <main className="admin-login">
    <div className="admin-login-card">
      <a className="admin-brand" href="/"><Image src="/kee-logo.png" width={40} height={40} alt="" />Study with Kee</a>
      <div className="admin-kicker">PRIVATE WORKSPACE</div>
      <h1>Welcome back, Kee.</h1>
      <p>Sign in to see what students are exploring and keep your journal and Store up to date.</p>
      {!adminConfigured() ? <div className="admin-alert">Admin access needs to be configured before this page can be used.</div> :
        <form action="/admin/session" method="post"><input type="hidden" name="action" value="login" /><label htmlFor="admin-password">Admin password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required /><button type="submit">Sign in</button></form>}
      {params?.error && <div role="alert" className="admin-alert">The password was not accepted. Please try again.</div>}
      <a className="admin-back" href="/">Back to the website</a>
    </div>
  </main>;
  const [analytics, articles, products] = await Promise.all([analyticsOverview(), articleList(), storeProducts()]);
  return <AdminWorkspace analytics={analytics} articles={articles} initialProducts={products} publishingReady={Boolean(process.env.GITHUB_CONTENT_TOKEN)} />;
}
