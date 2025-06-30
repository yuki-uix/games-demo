import { GameHeader } from "./GameHeader"
import { PatchTrack } from "./PatchTrack"
import { PlayerBoard } from "./PlayerBoard"
import { GameTrack } from "./GameTrack"
import { useGameLogic } from "./useGameLogic"
import { TopToolbar } from "@/components/ui/top-toolbar"

export function PatchworkGame() {
  const {
    gameState,
    currentPlayer,
    currentPlayerData,
    placementMode,
    hoveredCell,
    setHoveredCell,
    getAvailablePatches,
    selectPatch,
    placePatch,
    skipTurn,
    cancelPlacement,
  } = useGameLogic()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <TopToolbar />
      
      <div className="pt-20 p-6">
        <div className="max-w-[1800px] mx-auto">
          <GameHeader gameState={gameState} />

          <div className="relative min-h-[1000px]">
            {/* 拼图块赛道 - 跑道轨道 */}
            <div className="absolute inset-0 opacity-60">
              <PatchTrack
                gameState={gameState}
                currentPlayerData={currentPlayerData}
                onSelectPatch={selectPatch}
              />
            </div>

            {/* 中央游戏区域 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="grid grid-cols-3 gap-12 items-center pointer-events-auto">
                {/* 玩家1 操作区 */}
                <PlayerBoard
                  playerNumber={1}
                  playerData={gameState.player1}
                  isCurrentPlayer={currentPlayer === 1}
                  placementMode={placementMode}
                  hoveredCell={hoveredCell}
                  onCellClick={placePatch}
                  onCellHover={setHoveredCell}
                  onCellLeave={() => setHoveredCell(null)}
                  availablePatches={gameState.availablePatches}
                  isGameEnded={gameState.gamePhase === "ended"}
                />

                {/* 中央游戏进程赛道 */}
                <GameTrack
                  player1={gameState.player1}
                  player2={gameState.player2}
                  currentPlayer={currentPlayer}
                  placementMode={placementMode}
                  isGameEnded={gameState.gamePhase === "ended"}
                  availablePatches={getAvailablePatches()}
                  selectedPatch={gameState.selectedPatch}
                  onSkipTurn={skipTurn}
                  onCancelPlacement={cancelPlacement}
                />

                {/* 玩家2 操作区 */}
                <PlayerBoard
                  playerNumber={2}
                  playerData={gameState.player2}
                  isCurrentPlayer={currentPlayer === 2}
                  placementMode={placementMode}
                  hoveredCell={hoveredCell}
                  onCellClick={placePatch}
                  onCellHover={setHoveredCell}
                  onCellLeave={() => setHoveredCell(null)}
                  availablePatches={gameState.availablePatches}
                  isGameEnded={gameState.gamePhase === "ended"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 