import Link from "next/link";

const turnFlow = [
  { turn: "Turn 1", sequence: ["Troublemaker", "Checker"] },
  { turn: "Turn 2", sequence: ["Troublemaker", "Checker"] },
  { turn: "Turn 3", sequence: ["Troublemaker", "Checker"] },
  { turn: "Turn 4", sequence: ["Troublemaker", "Checker"] },
  { turn: "Turn 5", sequence: ["Troublemaker", "Checker"] },
];

const essayLines = [
  ["The archive of memories", null],
  ["rests beneath a quiet canopy", "memroies"],
  ["where every sentence should breathe", null],
  ["and every word should stay exact.", "exatct"],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(20,76,48,0.35),transparent_38%),linear-gradient(180deg,#07110b_0%,#020403_100%)] text-emerald-50">
      <header className="sticky top-0 z-20 border-b border-emerald-500/15 bg-black/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link
            href="/"
            className="text-lg font-semibold tracking-[0.32em] text-emerald-200 transition hover:text-emerald-100"
          >
            TypoDuel
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              className="rounded-full border border-emerald-400/20 bg-emerald-400/8 px-4 py-2 text-emerald-100 transition hover:border-emerald-300/40 hover:bg-emerald-300/12"
            >
              Home
            </Link>
            <button
              type="button"
              className="rounded-full border border-lime-400/30 bg-lime-400/15 px-4 py-2 font-medium text-lime-100 shadow-[0_0_0_1px_rgba(132,204,22,0.08)] transition hover:bg-lime-400/22 hover:text-white"
            >
              New game
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10 lg:px-10 lg:py-14">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-emerald-200">
              Type carefully. Break strategically.
            </div>

            <div className="max-w-3xl space-y-5">
              <h1 className="text-balance text-5xl font-semibold leading-tight text-emerald-50 md:text-6xl">
                A duel of edits, typos, and nerve.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-emerald-100/80">
                One player protects the essay. The other introduces mistakes.
                After five rounds, the final text decides who wins.
              </p>
            </div>
          </div>

          <aside className="rounded-4xl border border-emerald-400/15 bg-black/45 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
              Match rules
            </p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-emerald-50/80">
              <p>Checker can correct up to 6 letters each round.</p>
              <p>
                Troublemaker can change 5 letters each round to distort words
                and create typos.
              </p>
              <p>
                If more than 4 typos remain after Turn 5, the Troublemaker
                wins. Otherwise, the Checker wins.
              </p>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-4xl border border-emerald-400/15 bg-black/55 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                  Hero excerpt
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-emerald-50">
                  A page that already feels contested.
                </h2>
              </div>
              <span className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 text-xs text-red-200">
                Sample typos highlighted
              </span>
            </div>

            <div className="rounded-4xl border border-emerald-400/10 bg-[#06110a] p-6 text-[1.05rem] leading-9 text-emerald-50/90 md:p-8 md:text-[1.15rem]">
              <p className="font-serif italic text-emerald-100/75">
                {essayLines[0][0]}, with shadows that drift between the lines
                and a <span className="text-red-300">memroies</span> of the
                first draft still clinging to the page.
              </p>
              <p className="font-serif italic text-emerald-100/75">
                {essayLines[1][0]} beneath a patient sky, yet the sentence keeps
                slipping into <span className="text-red-300">canpoopy</span>
                shapes whenever no one is watching.
              </p>
              <p className="font-serif italic text-emerald-100/75">
                {essayLines[2][0]}, while the margins collect small errors like
                <span className="text-red-300"> brreath</span>,
                <span className="text-red-300"> exatct</span>, and other tiny
                fractures.
              </p>
              <p className="font-serif italic text-emerald-100/75">
                Even the final cadence feels almost
                <span className="text-red-300"> preicse</span>, though the
                page is crowded with slips that keep the duel alive.
              </p>
              <p className="font-serif italic text-emerald-100/75">
                A careful checker could still trace the rhythm through the
                noise, but the troublemaker hides new distortions in every
                clause, turning <span className="text-red-300">archvies</span>,
                <span className="text-red-300"> sentnce</span>, and
                <span className="text-red-300"> corrrect</span> into part of
                the contest.
              </p>
              <p className="font-serif italic text-emerald-100/75">
                By the time the fifth turn arrives, the page feels dense enough
                to test whether a final sweep can restore order or whether the
                accumulating mistakes will settle the score for good.
              </p>
            </div>
          </article>

          <section className="grid gap-6">
            <article className="rounded-4xl border border-emerald-400/15 bg-black/45 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                Turn order
              </p>
              <div className="mt-5 space-y-3">
                {turnFlow.map((turn) => (
                  <div
                    key={turn.turn}
                    className="flex items-center justify-between rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-emerald-100">
                        {turn.turn}
                      </p>
                      <p className="text-sm text-emerald-100/70">
                        {turn.sequence[0]} then {turn.sequence[1]}
                      </p>
                    </div>
                    <div className="rounded-full border border-emerald-400/15 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                      Round
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-4xl border border-emerald-400/15 bg-black/45 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                Core roles
              </p>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-emerald-50/80">
                <p>
                  <span className="font-semibold text-emerald-100">Checker:</span> preserves
                  the essay and corrects letters.
                </p>
                <p>
                  <span className="font-semibold text-emerald-100">Troublemaker:</span> injects
                  typos and bends words into new forms.
                </p>
                <p>
                  The match ends after five turns, with the typo count deciding
                  the winner.
                </p>
              </div>
            </article>
          </section>
        </section>
      </main>

      <footer className="border-t border-emerald-500/15 bg-black/55">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-1 px-6 py-6 text-center text-sm text-emerald-100/60 lg:px-10">
          <p className="text-base uppercase tracking-[0.35em] text-emerald-100/75">
            TypoDuel
          </p>
          <p>Copyrights &copy; 2026 Oskar Kownacki</p>
        </div>
      </footer>
    </div>
  );
}
