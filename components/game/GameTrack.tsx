import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AvailablePatch, PlayerData } from "./types"
import { BUTTON_REWARD_POSITIONS, INDEPENDENT_PATCH_POSITIONS } from "./constants"

interface GameTrackProps {
  player1: PlayerData
  player2: PlayerData
  currentPlayer: 1 | 2
  placementMode: boolean
  isGameEnded: boolean
  availablePatches: AvailablePatch[]
  selectedPatch: AvailablePatch | null
  onSkipTurn: () => void
  onCancelPlacement: () => void
}

export function GameTrack({
  player1,
  player2,
  currentPlayer,
  placementMode,
  isGameEnded,
  availablePatches,
  selectedPatch,
  onSkipTurn,
  onCancelPlacement
}: GameTrackProps) {
  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle className="text-center text-lg">游戏进程赛道</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 可选拼图块显示 */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm font-semibold mb-2 text-center">可选拼图块 (前3块)</div>
          <div className="grid grid-cols-3 gap-2">
            {availablePatches.map((patch) => (
              <div
                key={`available-${patch.id}`}
                className={`p-2 border rounded ${
                  selectedPatch?.id === patch.id
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div className="text-xs text-center mb-1">
                  💰{patch.cost} ⏱️{patch.time}
                </div>
                <div className="flex justify-center">
                  <div
                    className="inline-grid"
                    style={{
                      gridTemplateColumns: `repeat(${Math.max(...patch.shape.map((row) => row.length))}, 6px)`,
                      gridTemplateRows: `repeat(${patch.shape.length}, 6px)`,
                    }}
                  >
                    {patch.shape.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`${cell === 1 ? patch.color : "bg-transparent"}`}
                          style={{
                            gridRow: rowIndex + 1,
                            gridColumn: colIndex + 1,
                          }}
                        />
                      )),
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 52格游戏进程赛道 */}
        <div className="bg-amber-100 p-3 rounded-lg">
          <div className="text-sm font-semibold mb-2 text-center">52格进程赛道</div>
          <div className="grid grid-cols-13 gap-1">
            {Array.from({ length: 52 }, (_, i) => {
              const isButtonReward = BUTTON_REWARD_POSITIONS.includes(i + 1)
              const isIndependentPatch = INDEPENDENT_PATCH_POSITIONS.includes(i + 1)
              const p1Here = player1.timePosition === i + 1
              const p2Here = player2.timePosition === i + 1
              
              return (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border text-xs flex items-center justify-center ${
                    p1Here
                      ? "bg-blue-500 border-blue-600 text-white"
                      : p2Here
                        ? "bg-red-500 border-red-600 text-white"
                        : isButtonReward
                          ? "bg-green-200 border-green-400"
                          : isIndependentPatch
                            ? "bg-purple-200 border-purple-400"
                            : "bg-white border-gray-300"
                  }`}
                  title={`位置 ${i + 1}${isButtonReward ? ' - 纽扣奖励' : ''}${isIndependentPatch ? ' - 独立拼块' : ''}`}
                >
                  {isButtonReward ? '💰' : isIndependentPatch ? '🧩' : ''}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              玩家1: {player1.timePosition}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              玩家2: {player2.timePosition}
            </span>
          </div>
          <div className="text-xs text-center mt-2">
            <div>💰 = 纽扣获取 | 🧩 = 独立拼块</div>
          </div>
        </div>

        {/* 当前回合信息 */}
        <div className="text-center">
          {isGameEnded ? (
            <div className="text-lg font-semibold mb-2 text-green-700">游戏已结束</div>
          ) : (
            <>
              <div className="text-lg font-semibold mb-2">当前回合: 玩家{currentPlayer}</div>
              {placementMode && (
                <p className="text-sm text-muted-foreground mb-2">
                  点击你的操作区放置选中的拼图块
                </p>
              )}
            </>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="space-y-2">
          <Button
            onClick={onSkipTurn}
            variant="outline"
            disabled={placementMode || isGameEnded}
            className="w-full bg-transparent"
          >
            跳过回合 & 获取纽扣
          </Button>
          {placementMode && (
            <Button
              onClick={onCancelPlacement}
              variant="secondary"
              className="w-full"
            >
              取消放置
            </Button>
          )}
        </div>

        {/* 游戏规则说明 */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>时间落后的玩家先行动</p>
          <p>只能选择标记后3块拼图</p>
          <p>优先到达奖励格获得奖励</p>
          <p>独立拼块奖励：获得1x1拼图块</p>
          <p>游戏结束时：分数 = 纽扣数 - 空格数×2</p>
        </div>
      </CardContent>
    </Card>
  )
} 