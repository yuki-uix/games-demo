import { Card, CardContent } from "@/components/ui/card"
import { Patch } from "./types"

interface PatchCardProps {
  patch: Patch & { trackIndex?: number }
  isSelected?: boolean
  isAvailable?: boolean
  canAfford?: boolean
  isGameEnded?: boolean
  onClick?: () => void
  isMarker?: boolean
}

export function PatchCard({ 
  patch, 
  isSelected = false, 
  isAvailable = true, 
  canAfford = true, 
  isGameEnded = false,
  onClick,
  isMarker = false
}: PatchCardProps) {
  return (
    <div className="relative">
      {/* 标记指示器 */}
      {isMarker && (
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold z-40">
          木
        </div>
      )}
      <Card
        className={`cursor-pointer hover:shadow-xl transition-all w-24 h-32 rounded-xl ${
          isSelected ? "ring-3 ring-blue-500 shadow-xl scale-105" : ""
        } ${
          !isAvailable || isGameEnded
            ? "opacity-30 cursor-not-allowed"
            : !canAfford
              ? "opacity-60 cursor-not-allowed"
              : "hover:scale-110 hover:z-50"
        }`}
        onClick={(e) => {
          e.stopPropagation()
          if (onClick && isAvailable && canAfford && !isGameEnded) {
            onClick()
          }
        }}
      >
        <CardContent className="p-3 h-full flex flex-col justify-between">
          <div className="text-xs space-y-1">
            <div className="flex justify-between font-semibold">
              <span>💰{patch.cost}</span>
              <span>⏱️{patch.time}</span>
            </div>
            {patch.income > 0 && <div className="text-center font-semibold">🔘+{patch.income}</div>}
          </div>
          <div className="flex items-center justify-center flex-1">
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${Math.max(...patch.shape.map((row) => row.length))}, 10px)`,
                gridTemplateRows: `repeat(${patch.shape.length}, 10px)`,
              }}
            >
              {patch.shape.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`${cell === 1 ? `${patch.color} border border-gray-700` : "bg-transparent"}`}
                    style={{
                      gridRow: rowIndex + 1,
                      gridColumn: colIndex + 1,
                    }}
                  />
                )),
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 