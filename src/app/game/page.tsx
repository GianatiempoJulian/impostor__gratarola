
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from "canvas-confetti";
import type { GameSettings, Player } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BetterFlippableCard } from '@/components/flippable-card';
import { ArrowRight, ArrowLeft, RefreshCw, Home, Users, Hourglass, Eye, HelpCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/hooks/use-i18n';
import { LanguageSelector } from '@/components/language-selector';

type GamePhase = 'loading' | 'turn-transition' | 'reveal' | 'discuss' | 'results';

export default function GamePage() {
  const router = useRouter();
  const { t, tNoInterpolate } = useI18n();
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [word, setWord] = useState<string>('');
  
  const [phase, setPhase] = useState<GamePhase>('loading');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const initializeRound = (currentSettings: GameSettings) => {
    // 1. Select a word
    const randomWord = currentSettings.wordList[Math.floor(Math.random() * currentSettings.wordList.length)];
    setWord(randomWord);

    // 2. Assign impostors
    const numImpostorsToAssign = currentSettings.numImpostors === 2 && Math.random() < currentSettings.impostorProbability / 100 ? 2 : 1;
    
    const playerIndices = Array.from({ length: currentSettings.numPlayers }, (_, i) => i);
    const shuffledIndices = playerIndices.sort(() => Math.random() - 0.5);
    const impostorIndices = new Set(shuffledIndices.slice(0, numImpostorsToAssign));

    const newPlayers: Player[] = currentSettings.playerNames.map((name, index) => ({
      name,
      isImpostor: impostorIndices.has(index),
    }));

    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setIsRevealed(false);
    setPhase('turn-transition');
  };

  useEffect(() => {
    let storedSettings;
    if (typeof window !== 'undefined') {
      storedSettings = sessionStorage.getItem('gameSettings');
    }
    
    if (!storedSettings) {
      router.replace('/');
      return;
    }
    const parsedSettings: GameSettings = JSON.parse(storedSettings);
    setSettings(parsedSettings);
    initializeRound(parsedSettings);
  }, [router]);

  const handleNext = () => {
    setIsRevealed(false);
    if (phase === 'reveal') {
      if (currentPlayerIndex < settings!.numPlayers - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
        setPhase('turn-transition');
      } else {
        setPhase('discuss');
      }
    } else if (phase === 'turn-transition') {
      setPhase('reveal');
    }
  };
  
  const handleShowResults = () => {
    setPhase('results');
    if (typeof window !== 'undefined') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };
  
  const handleNewRound = () => {
    if(settings) initializeRound(settings);
  };
  
  const handleNewGame = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('gameSettings');
    }
    router.push('/');
  };

  const renderContent = () => {
    if (phase === 'loading' || !settings) {
      return (
        <Card className="w-full max-w-sm text-center animate-pulse">
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mx-auto" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 h-48">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      );
    }
    
    const currentPlayer = players[currentPlayerIndex];

    switch (phase) {
      case 'turn-transition':
        return (
          <Card className="w-full max-w-sm text-center" key={`turn-${currentPlayerIndex}`}>
            <CardHeader>
              <CardDescription>{t('pass_device_to')}</CardDescription>
              <CardTitle className="text-4xl font-bold">{currentPlayer.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 h-48">
                <Users className="w-16 h-16 text-primary" />
                <p className="text-muted-foreground">{t('are_you_ready')}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleNext}>
                {t('its_my_turn')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );

      case 'reveal':
        return (
          <div className="flex flex-col items-center gap-6 w-full max-w-sm text-center">
            <h2 className="text-2xl font-semibold">{t('your_turn_x', { name: currentPlayer.name })}</h2>
            <BetterFlippableCard
              isFlipped={isRevealed}
              onFlip={() => !isRevealed && setIsRevealed(true)}
              revealText={t('tap_to_reveal')}
              frontContent={<><HelpCircle className="h-12 w-12 mb-4" /><p className="text-2xl font-bold">{t('your_role_is_hidden')}</p></>}
              backContent={
                currentPlayer.isImpostor ? (
                  <>
                    <Eye className="h-12 w-12 text-destructive mb-4" />
                    <p className="text-2xl font-bold text-destructive">{t('you_are_impostor')}</p>
                    <p className="text-muted-foreground mt-2">{t('blend_in')}</p>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground">{t('the_word_is')}</p>
                    <p className="text-4xl font-bold tracking-wider">{word}</p>
                    <p className="text-muted-foreground mt-2">{t('you_are_not_impostor')}</p>
                  </>
                )
              }
            />
            {isRevealed && (
              <Button className="w-full animate-in fade-in duration-500" onClick={handleNext}>
                {t('continue')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        );

      case 'discuss':
        return (
          <Card className="w-full max-w-sm text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                  <Hourglass className="w-16 h-16 text-primary animate-spin" style={{ animationDuration: '3s' }}/>
              </div>
              <CardTitle className="text-4xl font-bold">{t('discussion_time')}</CardTitle>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center">
              <p className="text-lg text-muted-foreground">{t('find_the_impostor')}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleShowResults}>
                {t('reveal_impostors')} <Eye className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );

      case 'results':
        const impostors = players.filter(p => p.isImpostor);
        return (
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{t('game_over')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground">{t('the_word_was')}</h3>
                <p className="text-4xl font-bold text-primary">{word}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground">{impostors.length > 1 ? t('the_impostors_were') : t('the_impostor_was')}</h3>
                {impostors.map(p => (
                  <p key={p.name} className="text-3xl font-bold text-destructive">{p.name}</p>
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <Button className="flex-1" onClick={handleNewRound}>
                  <RefreshCw className="mr-2 h-4 w-4" /> {t('new_round')}
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleNewGame}>
                  <Home className="mr-2 h-4 w-4" /> {t('new_game')}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" onClick={handleNewGame}><ArrowLeft className="mr-2 h-4 w-4" /> {t('back')}</Button>
      </div>
       <div className="absolute top-4 right-4 flex items-center gap-4 text-sm text-muted-foreground">
        {settings?.topic && (
          <span className='hidden sm:inline'>{t('topic')}: {tNoInterpolate(`topics.${settings.topic.toLowerCase()}` as any, settings.topic)}</span>
        )}
        <LanguageSelector />
       </div>
      <div className="absolute bottom-4 left-4 text-sm text-muted-foreground">{t('round')}: {settings && players.length > 0 ? `${Math.min(currentPlayerIndex + 1, settings.numPlayers)}/${settings.numPlayers}` : ''}</div>
      <div className="flex items-center justify-center flex-1 w-full">
        {renderContent()}
      </div>
    </div>
  );
}
