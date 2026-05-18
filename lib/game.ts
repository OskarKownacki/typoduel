export type TurnRole = "Troublemaker" | "Checker";

export type EssayBoard = string[][];

export type CharacterPosition = {
  lineIndex: number;
  characterIndex: number;
};

export const totalTurns = 10;
export const actionLimitPerTurn = 5;

export function createBoard(lines: string[]): EssayBoard {
  return lines.map((line) => [...line]);
}

export function getTurnRole(turnIndex: number): TurnRole {
  return turnIndex % 2 === 0 ? "Troublemaker" : "Checker";
}

export function getRound(turnIndex: number): number {
  return Math.floor(turnIndex / 2) + 1;
}

export function getActionLimit(): number {
  return actionLimitPerTurn;
}

export function replaceCharacter(
  board: EssayBoard,
  position: CharacterPosition,
  nextCharacter: string,
): EssayBoard {
  return board.map((line, lineIndex) => {
    if (lineIndex !== position.lineIndex) {
      return line;
    }

    return line.map((character, characterIndex) =>
      characterIndex === position.characterIndex ? nextCharacter : character,
    );
  });
}

export function countTypos(current: EssayBoard, original: EssayBoard): number {
  let typoCount = 0;

  const lineCount = Math.max(current.length, original.length);

  for (let lineIndex = 0; lineIndex < lineCount; lineIndex += 1) {
    const currentLine = current[lineIndex] ?? [];
    const originalLine = original[lineIndex] ?? [];
    const characterCount = Math.max(currentLine.length, originalLine.length);

    for (let characterIndex = 0; characterIndex < characterCount; characterIndex += 1) {
      if ((currentLine[characterIndex] ?? "") !== (originalLine[characterIndex] ?? "")) {
        typoCount += 1;
      }
    }
  }

  return typoCount;
}