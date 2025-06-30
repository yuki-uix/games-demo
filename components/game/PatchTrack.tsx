import { PatchCard } from "./PatchCard"
import { AvailablePatch, GameState, PlayerData } from "./types"
import { getSquarePosition } from "./utils"

interface PatchTrackProps {
  gameState: GameState
  currentPlayerData: PlayerData
  onSelectPatch: (patch: AvailablePatch) => void
}

export function PatchTrack({
  gameState,
  currentPlayerData,
  onSelectPatch
}: PatchTrackProps) {
  // Get available patches (next 3 after marker)
  const getAvailablePatches = () => {
    const patches = []
    for (let i = 0; i < 3; i++) {
      const index = (gameState.markerPosition + i) % gameState.availablePatches.length
      if (gameState.availablePatches[index]) {
        patches.push({ ...gameState.availablePatches[index], trackIndex: index })
      }
    }
    return patches
  }

  const availablePatches = getAvailablePatches()

  return (
    <div className="absolute inset-0 pointer-events-none">
      {gameState.availablePatches.slice(0, 24).map((patch, index) => {
        const { x, y } = getSquarePosition(index, 24)
        const isMarker = index === gameState.markerPosition
        const isAvailable = availablePatches.some((p) => p.id === patch.id)

        return (
          <div
            key={`patch-${patch.id}-${index}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              zIndex: isMarker ? 30 : 20,
            }}
          >
            <PatchCard
              patch={{ ...patch, trackIndex: index }}
              isSelected={gameState.selectedPatch?.id === patch.id}
              isAvailable={isAvailable}
              canAfford={currentPlayerData.buttons >= patch.cost}
              isGameEnded={gameState.gamePhase === "ended"}
              isMarker={isMarker}
              onClick={() => {
                if (gameState.gamePhase === "ended") {
                  console.log("Game has ended, cannot select patches")
                  return
                }
                console.log(
                  "Patch clicked:",
                  patch.id,
                  "Available:",
                  isAvailable,
                  "Can afford:",
                  currentPlayerData.buttons >= patch.cost,
                )
                if (isAvailable && currentPlayerData.buttons >= patch.cost) {
                  onSelectPatch({ ...patch, trackIndex: index })
                }
              }}
            />
          </div>
        )
      })}
    </div>
  )
} 