// 游戏常量配置
export const BASE_PATCH_TEMPLATES = [
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
  {
    shape: [[1]], // 1x1 single cell for independent patch rewards
    baseColor: "teal",
  },
]

export const COLOR_VARIANTS = {
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
  teal: ["bg-teal-400", "bg-teal-500", "bg-teal-600"],
}

// 游戏进程赛道的奖励节点
export const BUTTON_REWARD_POSITIONS = [5, 11, 17, 23, 29, 34, 40, 46, 52]
export const INDEPENDENT_PATCH_POSITIONS = [26, 32, 37, 43, 49]

// 游戏配置
export const BOARD_SIZE = 9
export const TRACK_LENGTH = 52
export const INITIAL_BUTTONS = 5
export const PATCH_COUNT = 32 