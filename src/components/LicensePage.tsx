import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { IMGLY_URL, SOURCE_URL } from "@/lib/site";
import { useLocale } from "@/lib/use-i18n";

const A = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} target="_blank" rel="noreferrer">{children}</a>;

export function LicensePage() {
  const pt = useLocale() === "pt";
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="prose-page mx-auto max-w-3xl space-y-6 px-4 pt-6">
        {pt ? (
          <>
            <h1 className="page-title">Licença e código-fonte</h1>
            <section>
              <h2>GNU Affero General Public License v3.0</h2>
              <p>
                O QuikEdits é software livre: você pode redistribuí-lo e/ou modificá-lo nos termos da GNU Affero General
                Public License, publicada pela Free Software Foundation, versão 3. Ele é distribuído SEM NENHUMA GARANTIA,
                nem mesmo a garantia implícita de COMERCIALIZAÇÃO ou de ADEQUAÇÃO A UM DETERMINADO FIM. Veja o{" "}
                <A href="https://www.gnu.org/licenses/agpl-3.0.html">texto completo da licença</A> (em inglês).
              </p>
            </section>
            <section>
              <h2>Código-fonte correspondente</h2>
              <p>
                O código-fonte completo deste aplicativo, como publicado, está disponível em <A href={SOURCE_URL}>{SOURCE_URL}</A>.
                Se você modificar e hospedar este app, precisa oferecer o código modificado aos seus usuários sob a mesma licença.
              </p>
            </section>
            <section>
              <h2>Atribuição a terceiros</h2>
              <p>
                A remoção de fundo usa a biblioteca <A href={IMGLY_URL}>@imgly/background-removal</A> © IMG.LY GmbH, licenciada
                sob AGPL-3.0. Os arquivos do modelo de IA (© IMG.LY, AGPL-3.0) ficam hospedados neste site, são conferidos com as
                impressões digitais SHA-256 publicadas pela IMG.LY e guardados em cache no seu navegador. O uso comercial sem as
                obrigações da AGPL exige uma licença separada da IMG.LY.
              </p>
            </section>
            <section>
              <h2>Privacidade</h2>
              <p>Suas imagens são processadas no seu próprio aparelho e nunca são enviadas, guardadas ou compartilhadas.</p>
            </section>
          </>
        ) : (
          <>
            <h1 className="page-title">License &amp; source code</h1>
            <section>
              <h2>GNU Affero General Public License v3.0</h2>
              <p>
                QuikEdits is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
                General Public License as published by the Free Software Foundation, version 3. It is distributed
                WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
                PURPOSE. See the <A href="https://www.gnu.org/licenses/agpl-3.0.html">full license text</A>.
              </p>
            </section>
            <section>
              <h2>Corresponding source code</h2>
              <p>
                The complete source code of this application, as deployed, is available at <A href={SOURCE_URL}>{SOURCE_URL}</A>.
                If you modify and host this app, you must offer your modified source to its users under the same license.
              </p>
            </section>
            <section>
              <h2>Third-party attribution</h2>
              <p>
                Background removal is powered by <A href={IMGLY_URL}>@imgly/background-removal</A> © IMG.LY GmbH, licensed
                under AGPL-3.0. Its AI model files (© IMG.LY, AGPL-3.0) are hosted on this site, checked against IMG.LY's published SHA-256 fingerprints, and cached in your browser.
                Commercial use without AGPL obligations requires a separate licence from IMG.LY.
              </p>
            </section>
            <section>
              <h2>Privacy</h2>
              <p>Your images are processed on your own device and are never uploaded, stored or shared.</p>
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
