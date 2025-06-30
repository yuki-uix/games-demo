import { PatchCard } from "./PatchCard"
import { AvailablePatch, GameState, PlayerData } from "./types"
import { getSquarePosition } from "./utils"

interface PatchTrackProps {
  gameState: GameState
  currentPlayerData: PlayerData
  onSelectPatch: (patch: AvailablePatch) => void
  availablePatches: AvailablePatch[]
}

export function PatchTrack({
  gameState,
  currentPlayerData,
  onSelectPatch,
  availablePatches
}: PatchTrackProps) {
  // 计算 marker 位置（位于当前拼图块和下一个拼图块之间）
  const getMarkerPosition = () => {
    const currentPos = getSquarePosition(gameState.markerPosition, 24)
    const nextPos = getSquarePosition((gameState.markerPosition + 1) % 24, 24)
    
    // 计算中点位置
    const x = (currentPos.x + nextPos.x) / 2
    const y = (currentPos.y + nextPos.y) / 2
    
    return { x, y }
  }

  const markerPos = getMarkerPosition()

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 独立的 Marker 指示器 */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
        style={{
          left: `${markerPos.x}%`,
          top: `${markerPos.y}%`,
        }}
      >
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-xl border-3 border-white animate-pulse">
          🎯
        </div>
      </div>

      {gameState.availablePatches.slice(0, 24).map((patch, index) => {
        const { x, y } = getSquarePosition(index, 24)
        const isAvailable = availablePatches.some((p) => p.id === patch.id)

        return (
          <div
            key={`patch-${patch.id}-${index}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              zIndex: 20,
            }}
          >
            <PatchCard
              patch={{ ...patch, trackIndex: index }}
              isSelected={gameState.selectedPatch?.id === patch.id}
              isAvailable={isAvailable}
              canAfford={currentPlayerData.buttons >= patch.cost}
              isGameEnded={gameState.gamePhase === "ended"}
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