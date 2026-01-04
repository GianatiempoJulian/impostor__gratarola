"use client";

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, List } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useI18n } from '@/hooks/use-i18n';
import { LanguageSelector } from '@/components/language-selector';

export default function CustomWordsPage() {
  const { t } = useI18n();
  const [words, setWords] = useLocalStorage<string[]>('custom-words', []);
  const [newWord, setNewWord] = useState('');

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWord.trim() && !words.includes(newWord.trim())) {
      setWords([...words, newWord.trim()].sort());
      setNewWord('');
    }
  };

  const handleDeleteWord = (wordToDelete: string) => {
    setWords(words.filter(word => word !== wordToDelete));
  };

  return (
    <div className="container mx-auto flex flex-1 items-center justify-center p-4 sm:p-8">
      <div className="absolute top-4 right-4">
          <LanguageSelector />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl"><List /> {t('manage_custom_words')}</CardTitle>
          <CardDescription>{t('add_remove_words')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddWord} className="flex gap-2">
            <Input
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder={t('enter_new_word')}
              className="flex-grow"
            />
            <Button type="submit" size="icon" aria-label={t('add_word')}>
              <Plus />
            </Button>
          </form>
          <ScrollArea className="h-64 w-full rounded-md border">
            <div className="p-4">
              {words.length === 0 ? (
                <p className="text-center text-muted-foreground">{t('custom_list_empty')}</p>
              ) : (
                <ul className="space-y-2">
                  {words.map((word) => (
                    <li key={word} className="flex items-center justify-between rounded-md bg-secondary p-2">
                      <span className="font-medium">{word}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteWord(word)} aria-label={`${t('delete')} ${word}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
            <Button asChild variant="outline" className="w-full">
                <Link href="/?tab=custom"><ArrowLeft className="mr-2 h-4 w-4" /> {t('back_to_setup')}</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}