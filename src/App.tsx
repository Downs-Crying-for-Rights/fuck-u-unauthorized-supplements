import { useState } from 'react';
import { HeroSection } from '@/sections/HeroSection';
import { GameSection } from '@/sections/GameSection';
import { EndSection } from '@/sections/EndSection';
import { useGameLogic } from '@/hooks/useGameLogic';
import type { Difficulty } from '@/types/game';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [, setSelectedDifficulty] = useState<Difficulty>('medium');
  
  const {
    gameState: logicGameState,
    gameEnd,
    initializeGame,
    collectEvidence,
    submitReport,
    waitOneDay,
    getStatusText,
    getAIStrategyAdvice,
    getAIEvidenceAdvice,
    getAIChannelAdvice
  } = useGameLogic();

  const handleStartGame = (difficulty: Difficulty, enableAI: boolean) => {
    initializeGame(difficulty, enableAI);
    setSelectedDifficulty(difficulty);
    setGameStarted(true);
  };

  const handleRestart = () => {
    setGameStarted(false);
  };

  // 直接使用logicGameState
  const currentState = logicGameState;

  if (!gameStarted) {
    return <HeroSection onStartGame={handleStartGame} />;
  }

  if (gameEnd && currentState?.gamePhase === 'ended') {
    return <EndSection result={gameEnd} onRestart={handleRestart} />;
  }

  if (currentState) {
    return (
      <GameSection
        gameState={currentState}
        onCollectEvidence={collectEvidence}
        onSubmitReport={submitReport}
        onWaitOneDay={waitOneDay}
        getStatusText={getStatusText}
        onGetAIStrategyAdvice={getAIStrategyAdvice}
        onGetAIEvidenceAdvice={getAIEvidenceAdvice}
        onGetAIChannelAdvice={getAIChannelAdvice}
      />
    );
  }

  return <HeroSection onStartGame={handleStartGame} />;
}

export default App;
