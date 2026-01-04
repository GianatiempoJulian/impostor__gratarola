
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { topics, Topic } from '@/lib/topics';
import type { GameSettings } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Link from 'next/link';
import { ArrowRight, Users, Dices, ListPlus, Settings } from 'lucide-react';
import Logo from '@/components/logo';
import { useI18n } from '@/hooks/use-i18n';
import { LanguageSelector } from '@/components/language-selector';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';

const PlayerNameInputs = ({ numPlayers, playerNames, onNameChange }: { numPlayers: number; playerNames: string[]; onNameChange: (index: number, name: string) => void; }) => {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: numPlayers }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Label htmlFor={`player-${i}`} className="text-sm">{t('player_x', { number: i + 1 })}</Label>
          <Input
            id={`player-${i}`}
            value={playerNames[i]}
            onChange={(e) => onNameChange(i, e.target.value)}
            placeholder={t('player_x_name', { number: i + 1 })}
            required
          />
        </div>
      ))}
    </div>
  );
};

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, tNoInterpolate, language } = useI18n();
  const [numPlayers, setNumPlayers] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(15).fill(''));
  const [numImpostors, setNumImpostors] = useState<"1" | "2">("1");
  const [impostorProbability, setImpostorProbability] = useState(30);
  const [wordListSource, setWordListSource] = useState(searchParams.get('tab') || 'predefined');
  const [selectedTopic, setSelectedTopic] = useState(topics[0].key);
  const [customWords] = useLocalStorage<string[]>('custom-words', []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const defaultNames = Array.from({length: 15}, (_, i) => t('player_x', { number: i + 1 }));
    
    setPlayerNames(currentNames => {
      const updatedNames = [...currentNames];
      for (let i = 0; i < 15; i++) {
        // If a name is empty or is a placeholder from a previous language, update it.
        const isPlaceholder = /^(Player|Jugador|Joueur|Giocatore) \d+$/.test(updatedNames[i] || '');
        if (!updatedNames[i] || isPlaceholder) {
          updatedNames[i] = defaultNames[i];
        }
      }
      return updatedNames;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  useEffect(() => {
    if (numPlayers < 5) {
      setNumImpostors("1");
    }
  }, [numPlayers]);
  
  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    
    let wordList: string[];
    let topicName: string;

    if (wordListSource === 'predefined') {
      const topic = topics.find(t => t.key === selectedTopic);
      if (!topic) {
        alert('Selected topic not found.');
        return;
      }
      wordList = topic.words[language] || topic.words.en;
      topicName = selectedTopic;
    } else {
      wordList = customWords;
      topicName = 'Custom List';
    }

    if (!wordList || wordList.length < 1) {
      alert(t('empty_word_list_alert'));
      return;
    }
    
    const settings: GameSettings = {
      numPlayers,
      playerNames: playerNames.slice(0, numPlayers),
      numImpostors: parseInt(numImpostors),
      impostorProbability,
      wordList,
      topic: topicName
    };

    sessionStorage.setItem('gameSettings', JSON.stringify(settings));
    router.push('/game');
  };

  if (!isMounted) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-1 items-center justify-center p-4 sm:p-8">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl">Impostor__Gratarola</CardTitle>
          <CardDescription className="text-lg">{t('home_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStartGame} className="space-y-8">
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold"><Users/>{t('player_setup')}</h3>
              <div className="space-y-2">
                <Label htmlFor="num-players">{t('num_players')}: {numPlayers}</Label>
                <Slider
                  id="num-players"
                  min={3}
                  max={15}
                  step={1}
                  value={[numPlayers]}
                  onValueChange={(value) => setNumPlayers(value[0])}
                />
              </div>
              <PlayerNameInputs numPlayers={numPlayers} playerNames={playerNames} onNameChange={(index, name) => {
                const newNames = [...playerNames];
                newNames[index] = name;
                setPlayerNames(newNames);
              }} />
            </div>
            
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold"><Dices />{t('impostor_settings')}</h3>
              <div className="space-y-2">
                <Label>{t('num_impostors')}</Label>
                <RadioGroup value={numImpostors} onValueChange={(value: "1" | "2") => setNumImpostors(value)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="impostors-1" />
                    <Label htmlFor="impostors-1">{t('one_impostor')}</Label>
                  </div>
                  <div className={cn("flex items-center space-x-2", numPlayers < 5 && "opacity-50 cursor-not-allowed")}>
                    <RadioGroupItem value="2" id="impostors-2" disabled={numPlayers < 5}/>
                    <Label htmlFor="impostors-2" className={cn(numPlayers < 5 && "cursor-not-allowed")}>{t('one_or_two_impostors')}</Label>
                  </div>
                </RadioGroup>
              </div>
              {numImpostors === '2' && (
                <div className="space-y-2">
                  <Label htmlFor="impostor-prob">{t('two_impostors_probability')}: {impostorProbability}%</Label>
                  <Slider
                    id="impostor-prob"
                    min={0}
                    max={100}
                    step={5}
                    value={[impostorProbability]}
                    onValueChange={(value) => setImpostorProbability(value[0])}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold"><ListPlus/>{t('word_list')}</h3>
              <Tabs value={wordListSource} onValueChange={setWordListSource} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="predefined">{t('predefined')}</TabsTrigger>
                  <TabsTrigger value="custom">{t('custom')}</TabsTrigger>
                </TabsList>
                <TabsContent value="predefined" className="mt-4 space-y-2">
                  <Label>{t('topic')}</Label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_topic')} />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map(topic => (
                        <SelectItem key={topic.key} value={topic.key}>
                          <span className="mr-2">{topic.emoji}</span>
                          {tNoInterpolate(`topics.${topic.key}` as any, topic.key)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>
                <TabsContent value="custom" className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {customWords.length > 0 ? t('custom_list_count', { count: customWords.length }) : t('custom_list_empty')}
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/words"><Settings className="mr-2 h-4 w-4" />{t('manage_custom_words')}</Link>
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
            
            <CardFooter className="p-0">
              <Button type="submit" className="w-full text-lg" size="lg">
                {t('start_game')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


export default function Home() {
  return (
    <Suspense fallback={<div className="w-screen h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <HomePageContent />
    </Suspense>
  )
}
