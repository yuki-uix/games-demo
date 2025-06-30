"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Patch } from "./types"

interface PatchCardProps {
  patch: Patch & { trackIndex?: number }
  isSelected?: boolean
  isAvailable?: boolean
  canAfford?: boolean
  isGameEnded?: boolean
  onClick?: () => void
}

export function PatchCard({ 
  patch, 
  isSelected = false, 
  isAvailable = true, 
  canAfford = true, 
  isGameEnded = false,
  onClick
}: PatchCardProps) {
  return (
    <div className="relative">
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
          {/* 拼图块信息栏 */}
          <div className="text-xs font-semibold flex justify-center gap-2 mb-1">
            <span>💰{patch.cost}</span>
            <span>⏱️{patch.time}</span>
            {patch.income > 0 && <span>🔘+{patch.income}</span>}
          </div>
          {/* 拼图块形状 */}
          <div className="flex items-center justify-center flex-1">
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${Math.max(...patch.shape.map((row) => row.length))}, 14px)`,
                gridTemplateRows: `repeat(${patch.shape.length}, 14px)`,
                gap: '2px',
              }}
            >
              {patch.shape.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={cell === 1 ? `${patch.color} border-2 border-gray-700 rounded-sm` : "bg-transparent"}
                    style={{
                      gridRow: rowIndex + 1,
                      gridColumn: colIndex + 1,
                      width: '14px',
                      height: '14px',
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