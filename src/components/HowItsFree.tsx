const FREE_STEPS = [
  {
    title: "Your browser downloads the AI model",
    body: "On your first visit, your browser downloads the AI model. It's a fairly large file, from tens to a couple of hundred megabytes depending on the mode. Think of it like a website loading a piece of software before it can do its job.",
  },
  {
    title: "The model runs on your own device",
    body: "The AI runs on your own computer or phone, not on our servers. That's why we have no processing costs to pass on to you.",
  },
  {
    title: "You add a photo and remove its background",
    body: "Your photo stays on your device the whole time. Nothing is uploaded, stored or shared.",
  },
  {
    title: "Next time is faster",
    body: "Your browser can keep the model saved, so later visits usually skip the big download and start almost straight away.",
  },
];

export function HowItsFree() {
  return (
    <section aria-labelledby="how-free" className="mx-auto mb-12 max-w-5xl rounded-3xl border border-border bg-background p-6 sm:p-10">
      <h2 id="how-free" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        How is this <span className="text-primary">actually free?</span>
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        No catch, no trial, no hidden fees. Your own device does the work, so each image costs us nothing to process. Here's what happens:
      </p>
      <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FREE_STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-8 rounded-xl bg-accent px-4 py-3 text-sm text-accent-foreground">
        <strong>Heads up:</strong> the first download can take a minute on slower connections. If you're on mobile data, Wi-Fi is a good idea.
      </p>
    </section>
  );
}
