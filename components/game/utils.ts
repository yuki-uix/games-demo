import { Patch, PlayerData } from "./types"
import { BUTTON_REWARD_POSITIONS, INDEPENDENT_PATCH_POSITIONS, TRACK_LENGTH } from "./constants"
import { PATCH_CONFIGS } from "./patch-config"

// 生成拼图块（从配置文件读取）
export const generatePatches = (): Patch[] => {
  // 颜色池
  const colors = [
    "bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-cyan-400", "bg-lime-400", "bg-indigo-400", "bg-teal-400"
  ]
  return PATCH_CONFIGS.map((cfg, idx) => ({
    ...cfg,
    color: colors[idx % colors.length],
  }))
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

// 计算跑道轨道位置（矩形轨迹：沿着外圈白色方框的轨迹）
export const getSquarePosition = (index: number, total: number) => {
  const position = index % total
  
  // 矩形轨道布局参数
  const margin = 8 // 距离边缘的边距
  const trackWidth = 100 - 2 * margin // 轨道总宽度
  const trackHeight = 100 - 2 * margin // 轨道总高度
  
  // 计算矩形周长上的位置分布
  const perimeter = 2 * (trackWidth + trackHeight)
  const topLength = trackWidth
  const rightLength = trackHeight
  const bottomLength = trackWidth
  
  let x = 0, y = 0
  
  // 计算当前位置在周长上的距离
  const targetDistance = (position / total) * perimeter
  
  // 上边
  if (targetDistance < topLength) {
    x = margin + targetDistance
    y = margin
  }
  // 右边
  else if (targetDistance < topLength + rightLength) {
    x = margin + trackWidth
    y = margin + (targetDistance - topLength)
  }
  // 下边
  else if (targetDistance < topLength + rightLength + bottomLength) {
    x = margin + trackWidth - (targetDistance - topLength - rightLength)
    y = margin + trackHeight
  }
  // 左边
  else {
    x = margin
    y = margin + trackHeight - (targetDistance - topLength - rightLength - bottomLength)
  }
  
  return { x, y }
}

/**
 * 随机生成拼图块
 * @param params 生成参数
 * @returns Patch[]
 */
export const generateRandomPatches = (params: {
  count: number,
  shapes?: number[][][],
  costRange?: [number, number],
  timeRange?: [number, number],
  incomeChance?: number, // 0~1
  incomeRange?: [number, number],
}) => {
  const {
    count,
    shapes = [
      [[1, 1], [1, 0]],
      [[1, 1, 1]],
      [[1, 1], [1, 1]],
      [[1], [1], [1]],
      [[1, 1, 0], [0, 1, 1]],
      [[1, 0], [1, 1], [0, 1]],
      [[1, 1, 1, 1]],
      [[1, 1, 1], [1, 0, 0]],
      [[0, 1, 0], [1, 1, 1]],
      [[1, 0, 0], [1, 1, 1]],
      [[1]],
    ],
    costRange = [1, 6],
    timeRange = [1, 5],
    incomeChance = 0.3,
    incomeRange = [1, 2],
  } = params

  const colors = [
    "bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400", "bg-pink-400", "bg-orange-400", "bg-cyan-400", "bg-lime-400", "bg-indigo-400", "bg-teal-400"
  ]

  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

  return Array.from({ length: count }).map((_, i) => {
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    const cost = randomInt(costRange[0], costRange[1])
    const time = randomInt(timeRange[0], timeRange[1])
    const income = Math.random() < incomeChance ? randomInt(incomeRange[0], incomeRange[1]) : 0
    return {
      id: i + 1,
      shape,
      cost,
      time,
      income,
      color: colors[i % colors.length],
    }
  })
} 