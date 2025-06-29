"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Base patch templates
const BASE_PATCH_TEMPLATES = [
  {
    shape: [
      [1, 1],
      [1, 0],
    ],
    baseColor: "red",
  },
  {
    shape: [[1, 1, 1]],
    baseColor: "blue",
  },
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    baseColor: "green",
  },
  {
    shape: [[1], [1], [1]],
    baseColor: "yellow",
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    baseColor: "purple",
  },
  {
    shape: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    baseColor: "pink",
  },
  {
    shape: [[1, 1, 1, 1]],
    baseColor: "orange",
  },
  {
    shape: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    baseColor: "cyan",
  },
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    baseColor: "lime",
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    baseColor: "indigo",
  },
]

// Color variations
const COLOR_VARIANTS = {
  red: ["bg-red-400", "bg-red-500", "bg-red-600"],
  blue: ["bg-blue-400", "bg-blue-500", "bg-blue-600"],
  green: ["bg-green-400", "bg-green-500", "bg-green-600"],
  yellow: ["bg-yellow-400", "bg-yellow-500", "bg-yellow-600"],
  purple: ["bg-purple-400", "bg-purple-500", "bg-purple-600"],
  pink: ["bg-pink-400", "bg-pink-500", "bg-pink-600"],
  orange: ["bg-orange-400", "bg-orange-500", "bg-orange-600"],
  cyan: ["bg-cyan-400", "bg-cyan-500", "bg-cyan-600"],
  lime: ["bg-lime-400", "bg-lime-500", "bg-lime-600"],
  indigo: ["bg-indigo-400", "bg-indigo-500", "bg-indigo-600"],
}

// 游戏进程赛道的奖励节点
const BUTTON_REWARD_POSITIONS = [5, 11, 17, 23, 29, 34, 40, 46, 52]
const INDEPENDENT_PATCH_POSITIONS = [26, 32, 37, 43, 49]

// Generate random patches
const generatePatches = (count: number) => {
  const patches = []
  for (let i = 1; i <= count; i++) {
    const baseTemplate = BASE_PATCH_TEMPLATES[Math.floor(Math.random() * BASE_PATCH_TEMPLATES.length)]
    const colorVariant = COLOR_VARIANTS[baseTemplate.baseColor as keyof typeof COLOR_VARIANTS]
    const selectedColor = colorVariant[Math.floor(Math.random() * colorVariant.length)]

    // Calculate patch properties based on size
    const patchSize = baseTemplate.shape.flat().filter((cell) => cell === 1).length
    const cost = Math.max(1, Math.floor(patchSize * 0.8) + Math.floor(Math.random() * 3))
    const time = Math.max(1, Math.floor(patchSize * 0.6) + Math.floor(Math.random() * 2))
    const income = Math.random() < 0.3 ? Math.floor(Math.random() * 2) + 1 : 0

    patches.push({
      id: i,
      shape: baseTemplate.shape,
      cost,
      time,
      income,
      color: selectedColor,
    })
  }
  return patches
}

type GameState = {
  currentPlayer: 1 | 2
  player1: {
    board: number[][]
    buttons: number
    timePosition: number
    score: number
    accumulatedButtons: number // 积累的纽扣
    independentPatches: number // 独立拼块数量
  }
  player2: {
    board: number[][]
    buttons: number
    timePosition: number
    score: number
    accumulatedButtons: number // 积累的纽扣
    independentPatches: number // 独立拼块数量
  }
  availablePatches: ReturnType<typeof generatePatches>
  selectedPatch: ReturnType<typeof generatePatches>[0] | null
  markerPosition: number
  gamePhase: "playing" | "ended"
}

export default function PatchworkGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: 1,
    player1: {
      board: Array(9)
        .fill(null)
        .map(() => Array(9).fill(0)),
      buttons: 5,
      timePosition: 0,
      score: 0,
      accumulatedButtons: 0,
      independentPatches: 0,
    },
    player2: {
      board: Array(9)
        .fill(null)
        .map(() => Array(9).fill(0)),
      buttons: 5,
      timePosition: 0,
      score: 0,
      accumulatedButtons: 0,
      independentPatches: 0,
    },
    availablePatches: generatePatches(32),
    selectedPatch: null,
    markerPosition: 0,
    gamePhase: "playing",
  })

  const [placementMode, setPlacementMode] = useState(false)
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)

  // Determine current player based on time position (player behind goes first)
  const getCurrentPlayer = (): 1 | 2 => {
    if (gameState.player1.timePosition < gameState.player2.timePosition) {
      return 1
    } else if (gameState.player2.timePosition < gameState.player1.timePosition) {
      return 2
    } else {
      return gameState.currentPlayer // Keep current if tied
    }
  }

  const currentPlayer = getCurrentPlayer()
  const currentPlayerData = currentPlayer === 1 ? gameState.player1 : gameState.player2

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

  // 检查是否可以获得纽扣奖励
  const checkButtonReward = (playerKey: "player1" | "player2", newPosition: number) => {
    if (BUTTON_REWARD_POSITIONS.includes(newPosition)) {
      const player = gameState[playerKey]
      return player.accumulatedButtons
    }
    return 0
  }

  // 检查是否可以获得独立拼块
  const checkIndependentPatchReward = (playerKey: "player1" | "player2", newPosition: number) => {
    if (INDEPENDENT_PATCH_POSITIONS.includes(newPosition)) {
      // 检查是否已经有玩家到达过这个位置
      const otherPlayerKey = playerKey === "player1" ? "player2" : "player1"
      const otherPlayer = gameState[otherPlayerKey]
      
      // 如果另一个玩家还没有到达这个位置，当前玩家可以获得独立拼块
      if (otherPlayer.timePosition < newPosition) {
        return 1
      }
    }
    return 0
  }

  // 检查7x7完整正方形奖励
  const check7x7Reward = (board: number[][]) => {
    // 检查所有可能的7x7区域
    for (let startRow = 0; startRow <= 2; startRow++) {
      for (let startCol = 0; startCol <= 2; startCol++) {
        let isComplete = true
        for (let row = startRow; row < startRow + 7; row++) {
          for (let col = startCol; col < startCol + 7; col++) {
            if (board[row][col] === 0) {
              isComplete = false
              break
            }
          }
          if (!isComplete) break
        }
        if (isComplete) {
          return 7 // 7分奖励
        }
      }
    }
    return 0
  }

  const selectPatch = (patch: ReturnType<typeof generatePatches>[0] & { trackIndex: number }) => {
    console.log("Selecting patch:", patch.id, "Cost:", patch.cost, "Player buttons:", currentPlayerData.buttons)
    if (currentPlayerData.buttons >= patch.cost) {
      setGameState((prev) => ({
        ...prev,
        selectedPatch: patch,
      }))
      setPlacementMode(true)
      console.log("Patch selected, placement mode activated")
    } else {
      console.log("Not enough buttons to select this patch")
    }
  }

  const canPlacePatch = (board: number[][], patch: number[][], row: number, col: number): boolean => {
    for (let i = 0; i < patch.length; i++) {
      for (let j = 0; j < patch[i].length; j++) {
        if (patch[i][j] === 1) {
          const newRow = row + i
          const newCol = col + j
          if (newRow >= 9 || newCol >= 9 || board[newRow][newCol] !== 0) {
            return false
          }
        }
      }
    }
    return true
  }

  const placePatch = (row: number, col: number) => {
    console.log("Attempting to place patch at:", row, col, "Placement mode:", placementMode)

    if (!gameState.selectedPatch || !placementMode) {
      console.log("No patch selected or not in placement mode")
      return
    }

    const patch = gameState.selectedPatch as ReturnType<typeof generatePatches>[0] & { trackIndex: number }
    const playerKey = currentPlayer === 1 ? "player1" : "player2"
    const playerData = gameState[playerKey]

    console.log("Checking if patch can be placed...")
    if (canPlacePatch(playerData.board, patch.shape, row, col)) {
      console.log("Patch can be placed, placing now...")
      const newBoard = playerData.board.map((r) => [...r])

      // Place the patch
      for (let i = 0; i < patch.shape.length; i++) {
        for (let j = 0; j < patch.shape[i].length; j++) {
          if (patch.shape[i][j] === 1) {
            newBoard[row + i][col + j] = patch.id
          }
        }
      }

      const newTimePosition = Math.min(52, playerData.timePosition + patch.time)
      
      // 检查奖励
      const buttonReward = checkButtonReward(playerKey, newTimePosition)
      const independentPatchReward = checkIndependentPatchReward(playerKey, newTimePosition)
      const sevenBySevenReward = check7x7Reward(newBoard)

      setGameState((prev) => {
        // Remove the selected patch from available patches
        const newAvailablePatches = prev.availablePatches.filter((p) => p.id !== patch.id)

        return {
          ...prev,
          [playerKey]: {
            ...playerData,
            board: newBoard,
            buttons: playerData.buttons - patch.cost + patch.income + buttonReward,
            timePosition: newTimePosition,
            accumulatedButtons: buttonReward > 0 ? 0 : playerData.accumulatedButtons + patch.income,
            independentPatches: playerData.independentPatches + independentPatchReward,
            score: playerData.score + sevenBySevenReward,
          },
          availablePatches: newAvailablePatches,
          selectedPatch: null,
          markerPosition: patch.trackIndex,
        }
      })

      setPlacementMode(false)
      console.log("Patch placed successfully!")
    } else {
      console.log("Cannot place patch at this position")
    }
  }

  const skipTurn = () => {
    const otherPlayer = currentPlayer === 1 ? gameState.player2 : gameState.player1
    const timeDiff = Math.max(1, otherPlayer.timePosition - currentPlayerData.timePosition)
    const playerKey = currentPlayer === 1 ? "player1" : "player2"
    const newTimePosition = Math.min(52, otherPlayer.timePosition + 1)

    // 检查奖励
    const buttonReward = checkButtonReward(playerKey, newTimePosition)

    setGameState((prev) => ({
      ...prev,
      [playerKey]: {
        ...currentPlayerData,
        buttons: currentPlayerData.buttons + timeDiff + buttonReward,
        timePosition: newTimePosition,
        accumulatedButtons: buttonReward > 0 ? 0 : currentPlayerData.accumulatedButtons,
      },
    }))
  }

  const getPatchColor = (patchId: number) => {
    const patch = gameState.availablePatches.find((p) => p.id === patchId)
    if (patch) return patch.color

    // For placed patches, generate a consistent color based on ID
    const colors = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-pink-400"]
    return colors[patchId % colors.length] || "bg-gray-400"
  }

  const calculateScore = (player: typeof gameState.player1) => {
    const filledCells = player.board.flat().filter((cell) => cell !== 0).length
    const emptyPenalty = (81 - filledCells) * -2
    return player.buttons + emptyPenalty + player.score
  }

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      player1: { ...prev.player1, score: calculateScore(prev.player1) },
      player2: { ...prev.player2, score: calculateScore(prev.player2) },
      currentPlayer: getCurrentPlayer(),
    }))
  }, [gameState.player1.board, gameState.player2.board, gameState.player1.buttons, gameState.player2.buttons])

  // Calculate rectangular track positions with better spacing
  const getRectangularPosition = (index: number, total: number) => {
    const side = Math.ceil(total / 4)
    const position = index % total

    let x = 0,
      y = 0

    if (position < side) {
      // Top side
      x = (position / Math.max(side - 1, 1)) * 80 + 10
      y = 5
    } else if (position < side * 2) {
      // Right side
      x = 90
      y = ((position - side) / Math.max(side - 1, 1)) * 80 + 10
    } else if (position < side * 3) {
      // Bottom side
      x = 90 - ((position - side * 2) / Math.max(side - 1, 1)) * 80
      y = 90
    } else {
      // Left side
      x = 10
      y = 90 - ((position - side * 3) / Math.max(side - 1, 1)) * 80
    }

    return { x, y }
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">双人对决拼图游戏</h1>
          <p className="text-amber-700">拼图块赛道 + 游戏进程赛道</p>
        </div>

        <div className="relative min-h-[900px]">
          {/* 拼图块赛道 - 矩形轨道 */}
          <div className="absolute inset-0 pointer-events-none">
            {gameState.availablePatches.slice(0, 24).map((patch, index) => {
              const { x, y } = getRectangularPosition(index, 24)
              const isMarker = index === gameState.markerPosition
              const isAvailable = getAvailablePatches().some((p) => p.id === patch.id)

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
                  {/* 标记指示器 */}
                  {isMarker && (
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold z-40">
                      木
                    </div>
                  )}
                  <Card
                    className={`cursor-pointer hover:shadow-xl transition-all w-24 h-32 ${
                      gameState.selectedPatch?.id === patch.id ? "ring-3 ring-blue-500 shadow-xl scale-105" : ""
                    } ${
                      !isAvailable
                        ? "opacity-30 cursor-not-allowed"
                        : currentPlayerData.buttons < patch.cost
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:scale-110 hover:z-50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log(
                        "Patch clicked:",
                        patch.id,
                        "Available:",
                        isAvailable,
                        "Can afford:",
                        currentPlayerData.buttons >= patch.cost,
                      )
                      if (isAvailable && currentPlayerData.buttons >= patch.cost) {
                        selectPatch({ ...patch, trackIndex: index })
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
            })}
          </div>

          {/* 中央游戏区域 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="grid grid-cols-3 gap-8 items-center pointer-events-auto">
              {/* 玩家1 操作区 */}
              <Card className={`${currentPlayer === 1 ? "ring-3 ring-blue-500" : ""} w-80`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-lg">
                    玩家1 {currentPlayer === 1 && <span className="text-blue-500">← 当前</span>}
                  </CardTitle>
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Badge variant="secondary">🔘 {gameState.player1.buttons}</Badge>
                    <Badge variant="secondary">⏱️ {gameState.player1.timePosition}</Badge>
                    <Badge variant="outline">分数: {gameState.player1.score}</Badge>
                    <Badge variant="secondary">积累: {gameState.player1.accumulatedButtons}</Badge>
                    <Badge variant="secondary">独立: {gameState.player1.independentPatches}</Badge>
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
                    {gameState.player1.board.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`p1-${rowIndex}-${colIndex}`}
                          className={`border border-amber-400 cursor-pointer ${
                            cell === 0 ? "bg-white hover:bg-blue-50" : getPatchColor(cell)
                          } ${
                            placementMode &&
                            currentPlayer === 1 &&
                            hoveredCell?.row === rowIndex &&
                            hoveredCell?.col === colIndex
                              ? "ring-2 ring-blue-400"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log("Board cell clicked:", rowIndex, colIndex, "Current player:", currentPlayer)
                            if (currentPlayer === 1) {
                              placePatch(rowIndex, colIndex)
                            }
                          }}
                          onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                          onMouseLeave={() => setHoveredCell(null)}
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

              {/* 中央游戏进程赛道 */}
              <Card className="w-72">
                <CardHeader>
                  <CardTitle className="text-center text-lg">游戏进程赛道</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 可选拼图块显示 */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-semibold mb-2 text-center">可选拼图块 (前3块)</div>
                    <div className="grid grid-cols-3 gap-2">
                      {getAvailablePatches().map((patch) => (
                        <div
                          key={`available-${patch.id}`}
                          className={`p-2 border rounded ${
                            gameState.selectedPatch?.id === patch.id
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
                        const p1Here = gameState.player1.timePosition === i + 1
                        const p2Here = gameState.player2.timePosition === i + 1
                        
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
                        玩家1: {gameState.player1.timePosition}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        玩家2: {gameState.player2.timePosition}
                      </span>
                    </div>
                    <div className="text-xs text-center mt-2">
                      <div>💰 = 纽扣获取 | 🧩 = 独立拼块</div>
                    </div>
                  </div>

                  {/* 当前回合信息 */}
                  <div className="text-center">
                    <div className="text-lg font-semibold mb-2">当前回合: 玩家{currentPlayer}</div>
                    {placementMode && (
                      <p className="text-sm text-muted-foreground mb-2">
                        点击你的操作区放置选中的拼图块
                      </p>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="space-y-2">
                    <Button
                      onClick={skipTurn}
                      variant="outline"
                      disabled={placementMode}
                      className="w-full bg-transparent"
                    >
                      跳过回合 & 获取纽扣
                    </Button>
                    {placementMode && (
                      <Button
                        onClick={() => {
                          setPlacementMode(false)
                          setGameState((prev) => ({ ...prev, selectedPatch: null }))
                          console.log("Placement cancelled")
                        }}
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
                    <p>7x7完整正方形获得7分</p>
                  </div>
                </CardContent>
              </Card>

              {/* 玩家2 操作区 */}
              <Card className={`${currentPlayer === 2 ? "ring-3 ring-red-500" : ""} w-80`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-lg">
                    玩家2 {currentPlayer === 2 && <span className="text-red-500">← 当前</span>}
                  </CardTitle>
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Badge variant="secondary">🔘 {gameState.player2.buttons}</Badge>
                    <Badge variant="secondary">⏱️ {gameState.player2.timePosition}</Badge>
                    <Badge variant="outline">分数: {gameState.player2.score}</Badge>
                    <Badge variant="secondary">积累: {gameState.player2.accumulatedButtons}</Badge>
                    <Badge variant="secondary">独立: {gameState.player2.independentPatches}</Badge>
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
                    {gameState.player2.board.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`p2-${rowIndex}-${colIndex}`}
                          className={`border border-amber-400 cursor-pointer ${
                            cell === 0 ? "bg-white hover:bg-red-50" : getPatchColor(cell)
                          } ${
                            placementMode &&
                            currentPlayer === 2 &&
                            hoveredCell?.row === rowIndex &&
                            hoveredCell?.col === colIndex
                              ? "ring-2 ring-red-400"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log("Board cell clicked:", rowIndex, colIndex, "Current player:", currentPlayer)
                            if (currentPlayer === 2) {
                              placePatch(rowIndex, colIndex)
                            }
                          }}
                          onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                          onMouseLeave={() => setHoveredCell(null)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
