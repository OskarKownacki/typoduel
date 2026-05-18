"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { Essay } from "@/lib/essays";
import {
  countTypos,
  createBoard,
  getActionLimit,
  getRound,
  getTurnRole,
  replaceCharacter,
  totalTurns,
  type CharacterPosition,
} from "@/lib/game";

type GamePhase = "intro" | "active" | "handoff" | "result";

type GameClientProps = {
  essays: Essay[];
};

function formatRole(role: string): string {
  return role === "Troublemaker" ? "Troublemaker" : "Checker";
}

type LineToken =
  | {
      kind: "word";
      characters: Array<{ character: string; characterIndex: number }>;
    }
  | {
      kind: "space";
      key: string;
    };

function tokenizeLine(line: string[]): LineToken[] {
  const tokens: LineToken[] = [];
  let currentWord: Array<{ character: string; characterIndex: number }> = [];

  line.forEach((character, characterIndex) => {
    if (character === " ") {
      if (currentWord.length > 0) {
        tokens.push({ kind: "word", characters: currentWord });
        currentWord = [];
      }

      tokens.push({ kind: "space", key: `space-${characterIndex}` });
      return;
    }

    currentWord.push({ character, characterIndex });
  });

  if (currentWord.length > 0) {
    tokens.push({ kind: "word", characters: currentWord });
  }

  return tokens;
}

export function GameClient({ essays }: GameClientProps) {
  const [selectedEssayId, setSelectedEssayId] = useState(essays[0]?.id ?? "");
  const selectedEssay = useMemo(
    () => essays.find((essay) => essay.id === selectedEssayId) ?? essays[0],
    [essays, selectedEssayId],
  );
  const originalBoard = useMemo(
    () => createBoard(selectedEssay?.lines ?? []),
    [selectedEssay?.lines],
  );
  const [board, setBoard] = useState(() => createBoard(selectedEssay?.lines ?? []));
  const [turnIndex, setTurnIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [actionsUsed, setActionsUsed] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterPosition | null>(null);
  const [replacement, setReplacement] = useState("");

  const currentRole = getTurnRole(turnIndex);
  const currentRound = getRound(turnIndex);
  const actionLimit = getActionLimit();
  const remainingActions = Math.max(actionLimit - actionsUsed, 0);
  const typoCount = countTypos(board, originalBoard);
  const winner = typoCount > 4 ? "Troublemaker" : "Checker";

  function resetMatch(nextEssay = selectedEssay) {
    setBoard(createBoard(nextEssay?.lines ?? []));
    setTurnIndex(0);
    setPhase("intro");
    setActionsUsed(0);
    setSelectedCharacter(null);
    setReplacement("");
  }

  function handleEssayChange(nextEssayId: string) {
    const nextEssay = essays.find((essay) => essay.id === nextEssayId) ?? essays[0];

    if (!nextEssay) {
      return;
    }

    setSelectedEssayId(nextEssay.id);
    resetMatch(nextEssay);
  }

  function startMatch() {
    setPhase("active");
  }

  function revealNextTurn() {
    const nextTurnIndex = turnIndex + 1;

    if (nextTurnIndex >= totalTurns) {
      setPhase("result");
      return;
    }

    setTurnIndex(nextTurnIndex);
    setActionsUsed(0);
    setSelectedCharacter(null);
    setReplacement("");
    setPhase("active");
  }

  function endCurrentTurn() {
    if (turnIndex + 1 >= totalTurns) {
      setPhase("result");
      return;
    }

    setPhase("handoff");
  }

  function selectCharacter(position: CharacterPosition) {
    const currentCharacter = board[position.lineIndex]?.[position.characterIndex] ?? "";

    if (currentCharacter === " ") {
      return;
    }

    setSelectedCharacter(position);
    setReplacement(currentCharacter);
  }

  function applyReplacement() {
    if (!selectedCharacter || remainingActions <= 0) {
      return;
    }

    const nextCharacter = replacement[0];
    const currentCharacter =
      board[selectedCharacter.lineIndex]?.[selectedCharacter.characterIndex] ?? "";

    if (!nextCharacter || nextCharacter === " " || nextCharacter === currentCharacter) {
      return;
    }

    setBoard((currentBoard) =>
      replaceCharacter(currentBoard, selectedCharacter, nextCharacter),
    );
    setActionsUsed((value) => value + 1);
    setSelectedCharacter(null);
    setReplacement("");
  }

  const showGameShell = phase !== "intro";
  const canPlayTurn = phase === "active";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(20,76,48,0.35),transparent_38%),linear-gradient(180deg,#07110b_0%,#020403_100%)] text-emerald-50">
      <header className="sticky top-0 z-20 border-b border-emerald-500/15 bg-black/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-[0.32em] text-emerald-200 transition hover:text-emerald-100"
            >
              TypoDuel
            </Link>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/55">
              Hotseat match
            </p>
          </div>

          <button
            type="button"
            onClick={() => resetMatch()}
            className="rounded-full border border-emerald-400/20 bg-emerald-400/8 px-4 py-2 text-sm text-emerald-100 transition hover:border-emerald-300/40 hover:bg-emerald-300/12"
          >
            Restart
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10 lg:px-10 lg:py-14">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-4xl border border-emerald-400/15 bg-black/55 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)] lg:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">
                {selectedEssay?.title ?? "Untitled essay"}
              </span>
              {selectedEssay?.author ? (
                <span className="rounded-full border border-emerald-400/10 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-100/65">
                  {selectedEssay.author}
                </span>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/55">
                  Round
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-50">
                  {currentRound} / {Math.ceil(totalTurns / 2)}
                </p>
              </div>
              <div className="rounded-3xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/55">
                  Current player
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-50">
                  {formatRole(currentRole)}
                </p>
              </div>
              <div className="rounded-3xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/55">
                  Typos
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-50">
                  {typoCount}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-emerald-400/10 bg-[#06110a] p-5 text-[1rem] leading-8 text-emerald-50/90 md:p-7 md:text-[1.05rem]">
              {board.map((line, lineIndex) => (
                <p
                  key={`${selectedEssay?.id ?? "essay"}-${lineIndex}`}
                  className="mb-4 flex flex-wrap items-center gap-1 font-mono last:mb-0"
                >
                  {tokenizeLine(line).map((token) => {
                    if (token.kind === "space") {
                      return (
                        <span
                          key={`${selectedEssay?.id ?? "essay"}-${lineIndex}-${token.key}`}
                          className="inline-block w-3 shrink-0"
                          aria-hidden="true"
                        >
                          &nbsp;
                        </span>
                      );
                    }

                    return (
                      <span
                        key={`${selectedEssay?.id ?? "essay"}-${lineIndex}-${token.characters[0]?.characterIndex ?? 0}`}
                        className="inline-flex whitespace-nowrap"
                      >
                        {token.characters.map(({ character, characterIndex }) => {
                          const isSelected =
                            selectedCharacter?.lineIndex === lineIndex &&
                            selectedCharacter?.characterIndex === characterIndex;

                          return (
                            <button
                              key={`${selectedEssay?.id ?? "essay"}-${lineIndex}-${characterIndex}`}
                              type="button"
                              onClick={() =>
                                canPlayTurn && selectCharacter({ lineIndex, characterIndex })
                              }
                              className={`inline-flex min-w-5 items-center justify-center rounded-md border px-1.5 py-0.5 transition ${
                                isSelected
                                  ? "border-lime-300/70 bg-lime-300/15 text-white"
                                  : "border-transparent bg-transparent text-emerald-50/90 hover:border-emerald-300/25 hover:bg-emerald-400/8"
                              } ${canPlayTurn ? "cursor-pointer" : "cursor-default"}`}
                              disabled={!canPlayTurn}
                            >
                              {character}
                            </button>
                          );
                        })}
                      </span>
                    );
                  })}
                </p>
              ))}
            </div>
          </article>

          <aside className="grid gap-6">
            <article className="rounded-4xl border border-emerald-400/15 bg-black/45 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                Match rules
              </p>
              <div className="mt-5 space-y-4 text-sm leading-7 text-emerald-50/80">
                <p>Both players get 5 character edits per turn.</p>
                <p>Spaces stay locked; only visible characters can change.</p>
                <p>After five rounds, more than four typos means the Troublemaker wins.</p>
              </div>
            </article>

            <article className="rounded-4xl border border-emerald-400/15 bg-black/45 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                Turn controls
              </p>

              <label className="mt-5 block space-y-2 text-sm text-emerald-100/75">
                <span>Played essay</span>
                <select
                  value={selectedEssay?.id ?? ""}
                  onChange={(event) => handleEssayChange(event.target.value)}
                  className="w-full rounded-2xl border border-emerald-400/15 bg-black/40 px-4 py-3 text-emerald-50 outline-none transition focus:border-lime-400/40"
                >
                  {essays.map((essay) => (
                    <option key={essay.id} value={essay.id}>
                      {essay.title}
                      {essay.author ? ` — ${essay.author}` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <p className="mt-3 text-xs leading-6 text-emerald-100/55">
                Switching essays resets the match.
              </p>

              {phase === "intro" ? (
                <div className="mt-5 space-y-4">
                  <p className="text-sm leading-7 text-emerald-50/80">
                    Pass the device between players. The first turn belongs to the Troublemaker.
                  </p>
                  <button
                    type="button"
                    onClick={startMatch}
                    className="rounded-full border border-lime-400/30 bg-lime-400/15 px-4 py-2 text-sm font-medium text-lime-100 transition hover:bg-lime-400/22 hover:text-white"
                  >
                    Start match
                  </button>
                </div>
              ) : null}

              {showGameShell ? (
                <div className="mt-5 space-y-4">
                  {phase === "active" ? (
                    <>
                      <p className="text-sm leading-7 text-emerald-50/80">
                        {currentRole} turn. {remainingActions} character edits remaining.
                      </p>

                      <label className="block space-y-2 text-sm text-emerald-100/75">
                        <span>Replacement character</span>
                        <input
                          value={replacement}
                          onChange={(event) => setReplacement(event.target.value)}
                          maxLength={1}
                          disabled={!selectedCharacter}
                          className="w-full rounded-2xl border border-emerald-400/15 bg-black/40 px-4 py-3 text-emerald-50 outline-none transition placeholder:text-emerald-100/30 focus:border-lime-400/40"
                          placeholder={
                            selectedCharacter
                              ? "Type the replacement character"
                              : "Select a character from the essay first"
                          }
                        />
                      </label>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={applyReplacement}
                          disabled={!selectedCharacter || remainingActions <= 0}
                          className="rounded-full border border-emerald-400/20 bg-emerald-400/8 px-4 py-2 text-sm text-emerald-100 transition hover:border-emerald-300/40 hover:bg-emerald-300/12 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Commit edit
                        </button>
                        <button
                          type="button"
                          onClick={endCurrentTurn}
                          className="rounded-full border border-lime-400/30 bg-lime-400/15 px-4 py-2 text-sm font-medium text-lime-100 transition hover:bg-lime-400/22 hover:text-white"
                        >
                          End turn
                        </button>
                      </div>
                    </>
                  ) : null}

                  {phase === "handoff" ? (
                    <div className="space-y-4">
                      <p className="text-sm leading-7 text-emerald-50/80">
                        Hand the device to the next player and look away until the board is revealed.
                      </p>
                      <p className="text-lg font-semibold text-emerald-50">
                        Next turn: {formatRole(getTurnRole(turnIndex + 1))}
                      </p>
                      <button
                        type="button"
                        onClick={revealNextTurn}
                        className="rounded-full border border-lime-400/30 bg-lime-400/15 px-4 py-2 text-sm font-medium text-lime-100 transition hover:bg-lime-400/22 hover:text-white"
                      >
                        Reveal next turn
                      </button>
                    </div>
                  ) : null}

                  {phase === "result" ? (
                    <div className="space-y-4">
                      <p className="text-sm uppercase tracking-[0.25em] text-emerald-200/70">
                        Match over
                      </p>
                      <p className="text-2xl font-semibold text-emerald-50">
                        {winner} wins
                      </p>
                      <p className="text-sm leading-7 text-emerald-50/80">
                        Final typo count: {typoCount}
                      </p>
                      <button
                        type="button"
                        onClick={() => resetMatch()}
                        className="rounded-full border border-lime-400/30 bg-lime-400/15 px-4 py-2 text-sm font-medium text-lime-100 transition hover:bg-lime-400/22 hover:text-white"
                      >
                        Play again
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          </aside>
        </section>

        {phase === "active" ? (
          <section className="rounded-4xl border border-emerald-400/15 bg-black/45 p-6 text-sm text-emerald-50/75">
            <p className="uppercase tracking-[0.25em] text-emerald-200/70">Selected character</p>
            <p className="mt-3 text-base text-emerald-50">
              {selectedCharacter
                ? `Line ${selectedCharacter.lineIndex + 1}, character ${selectedCharacter.characterIndex + 1}`
                : "Select a character from the essay to edit it."}
            </p>
          </section>
        ) : null}
      </main>
    </div>
  );
}