import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayerData, Patch } from "./types"
import { getPatchColor } from "./utils"

interface PlayerBoardProps {
  playerNumber: 1 | 2
  playerData: PlayerData
  isCurrentPlayer: boolean
  placementMode: boolean
  hoveredCell: { row: number; col: number } | null
  onCellClick: (row: number, col: number) => void
  onCellHover: (value: { row: number; col: number } | null) => void
  onCellLeave: () => void
  availablePatches: Patch[]
  isGameEnded: boolean
}

export function PlayerBoard({
  playerNumber,
  playerData,
  isCurrentPlayer,
  placementMode,
  hoveredCell,
  onCellClick,
  onCellHover,
  onCellLeave,
  availablePatches,
  isGameEnded
}: PlayerBoardProps) {
  const getCardClassName = () => {
    if (isCurrentPlayer) {
      return playerNumber === 1 ? "ring-3 ring-blue-500 w-80" : "ring-3 ring-red-500 w-80"
    }
    return "w-80"
  }

  const getTitleClassName = () => {
    if (isCurrentPlayer) {
      return playerNumber === 1 ? "text-blue-500" : "text-red-500"
    }
    return ""
  }

  const getCellClassName = (cell: number, rowIndex: number, colIndex: number) => {
    let baseClass = "border border-amber-400 cursor-pointer"
    
    if (cell === 0) {
      baseClass += playerNumber === 1 ? " bg-white hover:bg-blue-50" : " bg-white hover:bg-red-50"
    } else {
      baseClass += ` ${getPatchColor(cell, availablePatches)}`
    }
    
    if (placementMode && isCurrentPlayer && hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex) {
      baseClass += playerNumber === 1 ? " ring-2 ring-blue-400" : " ring-2 ring-red-400"
    }
    
    return baseClass
  }

  return (
    <Card className={getCardClassName()}>
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">
          玩家{playerNumber} {isCurrentPlayer && <span className={getTitleClassName()}>← 当前</span>}
        </CardTitle>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">🔘 {playerData.buttons}</Badge>
          <Badge variant="secondary">⏱️ {playerData.timePosition}</Badge>
          <Badge variant="outline">分数: {playerData.score}</Badge>
          <Badge variant="secondary">积累: {playerData.accumulatedButtons}</Badge>
          <Badge variant="secondary">独立: {playerData.independentPatches}</Badge>
          <Badge variant="destructive">空格: {playerData.emptyCells}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="inline-grid bg-amber-100 p-3 rounded"
          style={{
            gridTemplateColumns: "repeat(9, 22px)",
            gridTemplateRows: "repeat(9, 22px)",
            gap: "1px",
          }}
        >
          {playerData.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`p${playerNumber}-${rowIndex}-${colIndex}`}
                className={getCellClassName(cell, rowIndex, colIndex)}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isGameEnded) {
                    console.log("Game has ended, cannot place patches")
                    return
                  }
                  console.log("Board cell clicked:", rowIndex, colIndex, "Current player:", playerNumber)
                  if (isCurrentPlayer) {
                    onCellClick(rowIndex, colIndex)
                  }
                }}
                onMouseEnter={() => onCellHover({ row: rowIndex, col: colIndex })}
                onMouseLeave={onCellLeave}
                style={{
                  gridRow: rowIndex + 1,
                  gridColumn: colIndex + 1,
                }}
              />
            )),
          )}
        </div>
      </CardContent>
    </Card>
  )
} 