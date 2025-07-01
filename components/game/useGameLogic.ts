import { useState } from "react"
import { GameState, AvailablePatch } from "./types"
import { generatePatches, generateRandomPatches, canPlacePatch, calculateEmptyCells, calculateFinalScore, checkGameEnd, checkButtonReward, checkIndependentPatchReward } from "./utils"
import { BOARD_SIZE, INITIAL_BUTTONS, TRACK_LENGTH } from "./constants"

export interface UseGameLogicOptions {
  useRandomPatches?: boolean
  randomPatchOptions?: Parameters<typeof generateRandomPatches>[0]
}

export function useGameLogic(options?: UseGameLogicOptions) {
  const patchList = options?.useRandomPatches
    ? generateRandomPatches(options.randomPatchOptions || { count: 20 })
    : generatePatches()

  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: 1,
    player1: {
      board: Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(0)),
      buttons: INITIAL_BUTTONS,
      timePosition: 0,
      score: 0,
      accumulatedButtons: 0,
      independentPatches: 0,
      emptyCells: BOARD_SIZE * BOARD_SIZE,
    },
    player2: {
      board: Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(0)),
      buttons: INITIAL_BUTTONS,
      timePosition: 0,
      score: 0,
      accumulatedButtons: 0,
      independentPatches: 0,
      emptyCells: BOARD_SIZE * BOARD_SIZE,
    },
    availablePatches: patchList,
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
    const patches: AvailablePatch[] = []
    const totalPatches = gameState.availablePatches.length
    
    if (totalPatches === 0) return patches
    
    console.log(`Marker position: ${gameState.markerPosition}, Total patches: ${totalPatches}`)
    
    for (let i = 0; i < 3; i++) {
      // 计算相对于标志位的位置，确保能够循环
      let index = (gameState.markerPosition + i + 1) % totalPatches
      
      // 如果索引为负数，转换为正数
      if (index < 0) {
        index = (index + totalPatches) % totalPatches
      }
      
      console.log(`Available patch ${i + 1}: index ${index}, patch:`, gameState.availablePatches[index]?.id)
      
      if (gameState.availablePatches[index]) {
        patches.push({ ...gameState.availablePatches[index], trackIndex: index })
      }
    }
    
    console.log(`Total available patches found: ${patches.length}`)
    return patches
  }

  const selectPatch = (patch: AvailablePatch) => {
    // 游戏结束时禁止操作
    if (gameState.gamePhase === "ended") {
      console.log("Game has ended, cannot select patches")
      return
    }
    
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

  const placePatch = (row: number, col: number) => {
    // 游戏结束时禁止操作
    if (gameState.gamePhase === "ended") {
      console.log("Game has ended, cannot place patches")
      return
    }
    
    console.log("Attempting to place patch at:", row, col, "Placement mode:", placementMode)

    if (!gameState.selectedPatch || !placementMode) {
      console.log("No patch selected or not in placement mode")
      return
    }

    const patch = gameState.selectedPatch
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

      const newTimePosition = Math.min(TRACK_LENGTH, playerData.timePosition + patch.time)
      const newEmptyCells = calculateEmptyCells(newBoard)
      
      // 检查奖励
      const buttonReward = checkButtonReward(playerData, newTimePosition)
      const independentPatchReward = checkIndependentPatchReward(playerKey, newTimePosition, gameState.player1, gameState.player2)
      
      console.log(`Button reward: ${buttonReward}`)
      console.log(`Independent patch reward:`, independentPatchReward)

      setGameState((prev) => {
        // Remove the selected patch from available patches
        const newAvailablePatches = prev.availablePatches.filter((p) => p.id !== patch.id)
        
        // Add independent patch reward if received
        const finalAvailablePatches = independentPatchReward 
          ? [...newAvailablePatches, independentPatchReward]
          : newAvailablePatches
        
        console.log(`Final available patches count: ${finalAvailablePatches.length}`)
        if (independentPatchReward) {
          console.log(`Added independent patch with ID: ${independentPatchReward.id}`)
        }

        const updatedState = {
          ...prev,
          [playerKey]: {
            ...playerData,
            board: newBoard,
            buttons: playerData.buttons - patch.cost + patch.income + buttonReward,
            timePosition: newTimePosition,
            accumulatedButtons: buttonReward > 0 ? 0 : playerData.accumulatedButtons + patch.income,
            independentPatches: playerData.independentPatches + (independentPatchReward ? 1 : 0),
            emptyCells: newEmptyCells,
          },
          availablePatches: finalAvailablePatches,
          selectedPatch: null,
          // 确保标志位在有效范围内循环
          markerPosition: finalAvailablePatches.length > 0 ? (patch.trackIndex % finalAvailablePatches.length) : 0,
        }

        console.log(`New marker position: ${updatedState.markerPosition}, Total patches: ${finalAvailablePatches.length}`)

        // 检查游戏是否结束
        if (checkGameEnd(updatedState.player1, updatedState.player2)) {
          const finalScore1 = calculateFinalScore(updatedState.player1)
          const finalScore2 = calculateFinalScore(updatedState.player2)
          
          return {
            ...updatedState,
            gamePhase: "ended",
            player1: { ...updatedState.player1, score: finalScore1 },
            player2: { ...updatedState.player2, score: finalScore2 },
          }
        }

        return updatedState
      })

      setPlacementMode(false)
      console.log("Patch placed successfully!")
    } else {
      console.log("Cannot place patch at this position")
    }
  }

  const skipTurn = () => {
    // 游戏结束时禁止操作
    if (gameState.gamePhase === "ended") {
      console.log("Game has ended, cannot skip turns")
      return
    }
    
    const otherPlayer = currentPlayer === 1 ? gameState.player2 : gameState.player1
    const timeDiff = Math.max(1, otherPlayer.timePosition - currentPlayerData.timePosition)
    const playerKey = currentPlayer === 1 ? "player1" : "player2"
    const newTimePosition = Math.min(TRACK_LENGTH, otherPlayer.timePosition + 1)

    // 检查奖励
    const buttonReward = checkButtonReward(currentPlayerData, newTimePosition)
    const independentPatchReward = checkIndependentPatchReward(playerKey, newTimePosition, gameState.player1, gameState.player2)
    
    console.log(`Skip turn - Button reward: ${buttonReward}`)
    console.log(`Skip turn - Independent patch reward:`, independentPatchReward)

    setGameState((prev) => {
      // Add independent patch reward if received
      const finalAvailablePatches = independentPatchReward 
        ? [...prev.availablePatches, independentPatchReward]
        : prev.availablePatches
      
      console.log(`Skip turn - Final available patches count: ${finalAvailablePatches.length}`)
      if (independentPatchReward) {
        console.log(`Skip turn - Added independent patch with ID: ${independentPatchReward.id}`)
      }

      const updatedState = {
        ...prev,
        [playerKey]: {
          ...currentPlayerData,
          buttons: currentPlayerData.buttons + timeDiff + buttonReward,
          timePosition: newTimePosition,
          accumulatedButtons: buttonReward > 0 ? 0 : currentPlayerData.accumulatedButtons,
          independentPatches: currentPlayerData.independentPatches + (independentPatchReward ? 1 : 0),
        },
        availablePatches: finalAvailablePatches,
      }

      // 检查游戏是否结束
      if (checkGameEnd(updatedState.player1, updatedState.player2)) {
        const finalScore1 = calculateFinalScore(updatedState.player1)
        const finalScore2 = calculateFinalScore(updatedState.player2)
        
        return {
          ...updatedState,
          gamePhase: "ended",
          player1: { ...updatedState.player1, score: finalScore1 },
          player2: { ...updatedState.player2, score: finalScore2 },
        }
      }

      return updatedState
    })
  }

  const cancelPlacement = () => {
    setPlacementMode(false)
    setGameState((prev) => ({ ...prev, selectedPatch: null }))
    console.log("Placement cancelled")
  }

  return {
    gameState,
    currentPlayer,
    currentPlayerData,
    placementMode,
    hoveredCell,
    setHoveredCell,
    getAvailablePatches,
    selectPatch,
    placePatch,
    skipTurn,
    cancelPlacement,
  }
} 