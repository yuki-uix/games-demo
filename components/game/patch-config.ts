export interface PatchConfig {
  id: number
  shape: number[][]
  cost: number
  time: number
  income: number
}

export const PATCH_CONFIGS: PatchConfig[] = [
  {
    id: 1,
    shape: [
      [1, 1],
      [1, 0],
    ],
    cost: 2,
    time: 1,
    income: 0,
  },
  {
    id: 2,
    shape: [
      [1, 1, 1],
    ],
    cost: 3,
    time: 2,
    income: 1,
  },
  {
    id: 3,
    shape: [
      [1, 1],
      [1, 1],
    ],
    cost: 4,
    time: 2,
    income: 0,
  },
  {
    id: 4,
    shape: [
      [1],
      [1],
      [1],
    ],
    cost: 1,
    time: 1,
    income: 0,
  },
  {
    id: 5,
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    cost: 5,
    time: 3,
    income: 2,
  },
  // ... 可继续添加更多拼图块
] 