import { useT } from "@/lib/use-i18n";

const FREE_STEPS = [
  {
    title: ("Your browser downloads the AI model"),
    body: ("On your first visit, your browser downloads the AI model. It's a fairly large file, from tens to a couple of hundred megabytes depending on the mode. Think of it like a website loading a piece of software before it can do its job."),
  },
  {
    title: ("The model runs on your own device"),
    body: ("The AI runs on your own computer or phone, not on our servers. That's why we have no processing costs to pass on to you."),
  },
  {
    title: ("You add a photo and remove its background"),
    body: ("Your photo stays on your device the whole time. Nothing is uploaded, stored or shared."),
  },
  {
    title: ("Next time is faster"),
    body: ("Your browser can keep the model saved, so later visits usually skip the big download and start almost straight away."),
  },
];

export function HowItsFree() {
  const t = useT();
  return (
    <section aria-labelledby="how-free" className="mx-auto mb-16 max-w-5xl rotate-[0.6deg] rounded-[1.75rem] border-4 border-foreground bg-card p-6 shadow-float sm:p-10">
      <h2 id="how-free" className="font-display text-5xl leading-none sm:text-6xl">
        {t("How is this")} <span className="text-primary">{t("actually free?")}</span>
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {t("No catch, no trial, no hidden fees. Your own device does the work, so each image costs us nothing to process. Here's what happens:")}
      </p>
      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {FREE_STEPS.map((s, i) => (
          <li key={s.title} className="border-t-4 border-foreground pt-4">
            <span className="font-display block text-5xl leading-none text-primary">0{i + 1}</span>
            <h3 className="font-display mt-3 text-2xl leading-none">{t(s.title)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(s.body)}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10 -rotate-[0.6deg] rounded-xl border-[3px] border-foreground bg-art-yellow px-4 py-3 text-sm font-medium text-foreground">
        <strong>{t("Heads up:")}</strong> {t("the first download can take a minute on slower connections. If you're on mobile data, Wi-Fi is a good idea.")}
      </p>
    </section>
  );
}
