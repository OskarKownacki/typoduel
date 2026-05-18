import { readFile } from "node:fs/promises";
import path from "node:path";

export type Essay = {
  id: string;
  title: string;
  author?: string;
  lines: string[];
};

type EssayFile = {
  id: string;
  title: string;
  author?: string;
  lines: string[];
};

function isEssayFile(value: unknown): value is EssayFile {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    Array.isArray(candidate.lines) &&
    candidate.lines.every((line) => typeof line === "string") &&
    (candidate.author === undefined || typeof candidate.author === "string")
  );
}

export async function loadEssays(): Promise<Essay[]> {
  const filePath = path.join(process.cwd(), "data", "essays.json");
  const rawContent = await readFile(filePath, "utf8");
  const parsedContent: unknown = JSON.parse(rawContent);

  if (!Array.isArray(parsedContent)) {
    throw new Error("Essay data must be an array.");
  }

  const essays = parsedContent.filter(isEssayFile);

  if (essays.length === 0) {
    throw new Error("At least one essay must be defined.");
  }

  return essays;
}