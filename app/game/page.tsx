import { GameClient } from "./game-client";

import { loadEssays } from "@/lib/essays";

export default async function GamePage() {
  const essays = await loadEssays();

  return <GameClient essays={essays} />;
}