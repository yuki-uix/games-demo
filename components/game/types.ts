// 游戏类型定义
export type Patch = {
  id: number
  shape: number[][]
  cost: number
  time: number
  income: number
  color: string
  isIndependentReward?: boolean
}

export type PlayerData = {
  board: number[][]
  buttons: number
  timePosition: number
  score: number
  accumulatedButtons: number
  independentPatches: number
  emptyCells: number
}

export type GameState = {
  currentPlayer: 1 | 2
  player1: PlayerData
  player2: PlayerData
  availablePatches: Patch[]
  selectedPatch: (Patch & { trackIndex: number }) | null
  markerPosition: number
  gamePhase: "playing" | "ended"
}

export type AvailablePatch = Patch & { trackIndex: number } 