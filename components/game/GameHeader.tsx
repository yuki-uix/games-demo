"use client"

import { GameState } from "./types"
import { useTranslation } from "@/lib/useTranslation"

interface GameHeaderProps {
  gameState: GameState
}

export function GameHeader({ gameState }: GameHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="text-center mb-6">
      <h1 className="text-4xl font-bold text-amber-900 mb-2">{t('gameTitle')}</h1>
      <p className="text-amber-700">{t('gameSubtitle')}</p>
      
      {gameState.gamePhase === "ended" && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-2">{t('gameEnded')}</h2>
          <div className="flex justify-center gap-8 text-lg">
            <div className="text-blue-600">
              {t('player1Score')}: {gameState.player1.score}
            </div>
            <div className="text-red-600">
              {t('player2Score')}: {gameState.player2.score}
            </div>
          </div>
          <div className="mt-2 text-green-700 font-semibold">
            {gameState.player1.score > gameState.player2.score 
              ? t('player1Wins')
              : gameState.player2.score > gameState.player1.score 
                ? t('player2Wins')
                : t('draw')}
          </div>
        </div>
      )}
    </div>
  )
} 