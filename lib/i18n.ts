// 支持的语言类型
export type Language = 'zh' | 'en'

// 翻译键类型
export type TranslationKey = 
  | 'gameTitle'
  | 'gameSubtitle'
  | 'gameEnded'
  | 'player1Score'
  | 'player2Score'
  | 'player1Wins'
  | 'player2Wins'
  | 'draw'
  | 'player1'
  | 'player2'
  | 'currentPlayer'
  | 'skipTurn'
  | 'cancel'
  | 'place'
  | 'select'
  | 'gamePhase'
  | 'playing'
  | 'ended'
  | 'gameProgressTrack'
  | 'availablePatches'
  | 'gameRules'
  | 'score'
  | 'buttons'
  | 'time'
  | 'accumulated'
  | 'independent'
  | 'emptyCells'
  | 'marker'
  | 'buttonReward'
  | 'independentPatch'
  | 'position'
  | 'currentTurn'
  | 'placeSelectedPatch'
  | 'skipTurnAndGetButtons'
  | 'cancelPlacement'
  | 'rule1'
  | 'rule2'
  | 'rule3'
  | 'rule4'
  | 'rule5'

// 翻译内容
const translations: Record<Language, Record<TranslationKey, string>> = {
  zh: {
    gameTitle: '双人对决拼图游戏',
    gameSubtitle: '拼图块赛道 + 游戏进程赛道',
    gameEnded: '游戏结束！',
    player1Score: '玩家1最终分数',
    player2Score: '玩家2最终分数',
    player1Wins: '玩家1获胜！',
    player2Wins: '玩家2获胜！',
    draw: '平局！',
    player1: '玩家1',
    player2: '玩家2',
    currentPlayer: '当前',
    skipTurn: '跳过回合',
    cancel: '取消',
    place: '放置',
    select: '选择',
    gamePhase: '游戏阶段',
    playing: '进行中',
    ended: '已结束',
    gameProgressTrack: '游戏进程赛道',
    availablePatches: '可选拼图块 (前3块)',
    gameRules: '游戏规则说明',
    score: '分数',
    buttons: '纽扣',
    time: '时间',
    accumulated: '积累',
    independent: '独立',
    emptyCells: '空格',
    marker: '当前位置',
    buttonReward: '纽扣奖励',
    independentPatch: '独立拼块',
    position: '位置',
    currentTurn: '当前回合',
    placeSelectedPatch: '点击你的操作区放置选中的拼图块',
    skipTurnAndGetButtons: '跳过回合 & 获取纽扣',
    cancelPlacement: '取消放置',
    rule1: '时间落后的玩家先行动',
    rule2: '只能选择标记前3块拼图',
    rule3: '优先到达奖励格获得奖励',
    rule4: '独立拼块奖励：获得1x1拼图块',
    rule5: '游戏结束时：分数 = 纽扣数 - 空格数×2'
  },
  en: {
    gameTitle: 'Two-Player Patchwork Game',
    gameSubtitle: 'Patch Track + Game Progress Track',
    gameEnded: 'Game Over!',
    player1Score: 'Player 1 Final Score',
    player2Score: 'Player 2 Final Score',
    player1Wins: 'Player 1 Wins!',
    player2Wins: 'Player 2 Wins!',
    draw: 'It\'s a Draw!',
    player1: 'Player 1',
    player2: 'Player 2',
    currentPlayer: 'Current',
    skipTurn: 'Skip Turn',
    cancel: 'Cancel',
    place: 'Place',
    select: 'Select',
    gamePhase: 'Game Phase',
    playing: 'Playing',
    ended: 'Ended',
    gameProgressTrack: 'Game Progress Track',
    availablePatches: 'Available Patches (Next 3)',
    gameRules: 'Game Rules',
    score: 'Score',
    buttons: 'Buttons',
    time: 'Time',
    accumulated: 'Accumulated',
    independent: 'Independent',
    emptyCells: 'Empty Cells',
    marker: 'Current',
    buttonReward: 'Button Reward',
    independentPatch: 'Independent Patch',
    position: 'Position',
    currentTurn: 'Current Turn',
    placeSelectedPatch: 'Click your board to place the selected patch',
    skipTurnAndGetButtons: 'Skip Turn & Get Buttons',
    cancelPlacement: 'Cancel Placement',
    rule1: 'Player with less time moves first',
    rule2: 'Can only select 3 patches before marker',
    rule3: 'Reach reward spaces first to get rewards',
    rule4: 'Independent patch reward: Get 1x1 patch',
    rule5: 'Game end: Score = Buttons - Empty cells × 2'
  }
}

// 检测浏览器语言
export function detectLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en' // 服务端默认返回英语
  }

  const browserLang = navigator.language.toLowerCase()
  
  if (browserLang.startsWith('zh')) {
    return 'zh'
  } else {
    return 'en' // 默认英语
  }
}

// 翻译函数
export function t(key: TranslationKey, language?: Language): string {
  const lang = language || detectLanguage()
  return translations[lang][key] || key
}

// 获取当前语言
export function getCurrentLanguage(): Language {
  return detectLanguage()
}

// 获取支持的语言列表
export function getSupportedLanguages(): Language[] {
  return ['en', 'zh']
}

// 语言名称映射
export const languageNames: Record<Language, string> = {
  zh: '中文',
  en: 'English'
} 