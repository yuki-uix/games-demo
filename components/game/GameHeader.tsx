import { GameState } from "./types"

interface GameHeaderProps {
  gameState: GameState
}

export function GameHeader({ gameState }: GameHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-4xl font-bold text-amber-900 mb-2">双人对决拼图游戏</h1>
      <p className="text-amber-700">拼图块赛道 + 游戏进程赛道</p>
      {gameState.gamePhase === "ended" && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-2">游戏结束！</h2>
          <div className="flex justify-center gap-8 text-lg">
            <div className="text-blue-600">
              玩家1最终分数: {gameState.player1.score}
            </div>
            <div className="text-red-600">
              玩家2最终分数: {gameState.player2.score}
            </div>
          </div>
          <div className="mt-2 text-green-700 font-semibold">
            {gameState.player1.score > gameState.player2.score 
              ? "玩家1获胜！" 
              : gameState.player2.score > gameState.player1.score 
                ? "玩家2获胜！" 
                : "平局！"}
          </div>
        </div>
      )}
    </div>
  )
} 