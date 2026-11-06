import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { IMGLY_URL, SOURCE_URL } from "@/lib/site";

export const Route = createFileRoute("/license")({
  head: () => ({
    meta: [
      { title: "License & Source Code — Cutout" },
      { name: "description", content: "Cutout is free software under the GNU AGPL-3.0. Attribution, licensing and source code." },
      { property: "og:title", content: "License & Source Code — Cutout" },
      { property: "og:description", content: "AGPL-3.0 licensing, IMG.LY attribution and full source code for Cutout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LicensePage,
});

function LicensePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto max-w-3xl px-4 py-5">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">cutout<span className="text-primary">.</span></Link>
      </header>
      <main className="prose-page mx-auto max-w-3xl space-y-6 px-4 pt-6">
        <h1 className="font-display text-4xl font-bold tracking-tight">License &amp; source code</h1>
        <section>
          <h2>GNU Affero General Public License v3.0</h2>
          <p>
            Cutout is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
            General Public License as published by the Free Software Foundation, version 3. It is distributed
            WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
            PURPOSE. See the{" "}
            <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noreferrer">full license text</a>.
          </p>
        </section>
        <section>
          <h2>Corresponding source code</h2>
          <p>
            The complete source code of this application, as deployed, is available at{" "}
            <a href={SOURCE_URL} target="_blank" rel="noreferrer">{SOURCE_URL}</a>. If you modify and host this app,
            you must offer your modified source to its users under the same license.
          </p>
        </section>
        <section>
          <h2>Third-party attribution</h2>
          <p>
            Background removal is powered by{" "}
            <a href={IMGLY_URL} target="_blank" rel="noreferrer">@imgly/background-removal</a> © IMG.LY GmbH, licensed
            under AGPL-3.0. Its AI model files (© IMG.LY, AGPL-3.0) are hosted on this site, checked against IMG.LY's published SHA-256 fingerprints, and cached in your browser.
            Commercial use without AGPL obligations requires a separate licence from IMG.LY.
          </p>
        </section>
        <section>
          <h2>Privacy</h2>
          <p>Your images are processed on your own device and are never uploaded, stored or shared.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
