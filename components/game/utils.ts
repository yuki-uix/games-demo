import { Patch, PlayerData } from "./types"
import { BASE_PATCH_TEMPLATES, COLOR_VARIANTS, BUTTON_REWARD_POSITIONS, INDEPENDENT_PATCH_POSITIONS, TRACK_LENGTH } from "./constants"

// 生成随机拼图块
export const generatePatches = (count: number): Patch[] => {
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

// 检查是否可以放置拼图块
export const canPlacePatch = (board: number[][], patch: number[][], row: number, col: number): boolean => {
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

// 计算剩余空格数量
export const calculateEmptyCells = (board: number[][]): number => {
  return board.flat().filter((cell) => cell === 0).length
}

// 计算最终分数（只在游戏结束时）
export const calculateFinalScore = (player: PlayerData): number => {
  const emptyPenalty = player.emptyCells * 2
  return player.buttons - emptyPenalty
}

// 检查游戏是否结束
export const checkGameEnd = (player1: PlayerData, player2: PlayerData): boolean => {
  return player1.timePosition >= TRACK_LENGTH && player2.timePosition >= TRACK_LENGTH
}

// 检查是否可以获得纽扣奖励
export const checkButtonReward = (player: PlayerData, newPosition: number): number => {
  if (BUTTON_REWARD_POSITIONS.includes(newPosition)) {
    return player.accumulatedButtons
  }
  return 0
}

// 检查是否可以获得独立拼块
export const checkIndependentPatchReward = (
  playerKey: "player1" | "player2", 
  newPosition: number, 
  player1: PlayerData, 
  player2: PlayerData
): Patch | null => {
  console.log(`Checking independent patch reward for ${playerKey} at position ${newPosition}`)
  console.log(`Independent patch positions: ${INDEPENDENT_PATCH_POSITIONS}`)
  
  if (INDEPENDENT_PATCH_POSITIONS.includes(newPosition)) {
    // 检查是否已经有玩家到达过这个位置
    const otherPlayerKey = playerKey === "player1" ? "player2" : "player1"
    const otherPlayer = playerKey === "player1" ? player2 : player1
    
    console.log(`Other player (${otherPlayerKey}) time position: ${otherPlayer.timePosition}`)
    
    // 如果另一个玩家还没有到达这个位置，当前玩家可以获得独立拼块
    if (otherPlayer.timePosition < newPosition) {
      console.log(`Player ${playerKey} gets independent patch reward!`)
      // 创建一个1x1的独立拼图块
      const independentPatch: Patch = {
        id: 1000 + newPosition, // 使用特殊ID避免冲突
        shape: [[1]],
        cost: 0,
        time: 0,
        income: 0,
        color: "bg-teal-500",
        isIndependentReward: true,
      }
      return independentPatch
    } else {
      console.log(`Other player already reached position ${newPosition}, no reward`)
    }
  } else {
    console.log(`Position ${newPosition} is not an independent patch position`)
  }
  return null
}

// 获取拼图块颜色
export const getPatchColor = (patchId: number, availablePatches: Patch[]): string => {
  const patch = availablePatches.find((p) => p.id === patchId)
  if (patch) return patch.color

  // For placed patches, generate a consistent color based on ID
  const colors = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-pink-400"]
  return colors[patchId % colors.length] || "bg-gray-400"
}

// 计算方形轨道位置
export const getSquarePosition = (index: number, total: number) => {
  const side = Math.ceil(total / 4)
  const position = index % total
  
  // 计算方形轨道的边界（距离内部内容12%的margin）
  const margin = 12
  const minX = margin
  const maxX = 100 - margin
  const minY = margin
  const maxY = 100 - margin
  
  // 计算每边的长度
  const sideLength = (maxX - minX) / 2
  
  let x = 0, y = 0
  
  if (position < side) {
    // Top side
    x = minX + (position / Math.max(side - 1, 1)) * sideLength * 2
    y = minY
  } else if (position < side * 2) {
    // Right side
    x = maxX
    y = minY + ((position - side) / Math.max(side - 1, 1)) * sideLength * 2
  } else if (position < side * 3) {
    // Bottom side
    x = maxX - ((position - side * 2) / Math.max(side - 1, 1)) * sideLength * 2
    y = maxY
  } else {
    // Left side
    x = minX
    y = maxY - ((position - side * 3) / Math.max(side - 1, 1)) * sideLength * 2
  }
  
  return { x, y }
} 