"use client";

import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlippableCard({ frontContent, backContent, isFlipped, onFlip }: FlippableCardProps) {
  const cardClasses = cn(
    "relative w-full h-64 sm:h-80 transition-transform duration-700 rounded-xl shadow-2xl",
    "transform-style-3d",
    isFlipped ? "rotate-y-180" : ""
  );

  const faceClasses = "absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-6 text-center rounded-xl";

  return (
    <div className="perspective-1000 w-full max-w-sm">
      <div className={cardClasses} onClick={onFlip}>
        <div className={cn(faceClasses, "bg-accent text-accent-foreground")}>
          {frontContent}
        </div>
        <div className={cn(faceClasses, "bg-card text-card-foreground rotate-y-180")}>
          {backContent}
        </div>
      </div>
    </div>
  );
}


export function BetterFlippableCard({ frontContent, backContent, isFlipped, onFlip, revealText = "Tap to reveal" }: { frontContent: React.ReactNode; backContent: React.ReactNode; isFlipped: boolean; onFlip: () => void; revealText?: string; }) {

  return (
    <div className="w-full max-w-sm [perspective:1000px]">
      <div 
        className={cn(
          "relative w-full h-64 sm:h-80 cursor-pointer transition-transform duration-700 rounded-xl shadow-2xl [transform-style:preserve-3d]",
          isFlipped && "[transform:rotateY(180deg)]"
        )}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onFlip()}
        aria-label={isFlipped ? "Card revealed" : "Card hidden, press to reveal"}
      >
        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-xl flex flex-col items-center justify-center p-6 text-center bg-accent text-accent-foreground">
          {frontContent}
          {!isFlipped && <Button variant="ghost" className="mt-4 animate-pulse pointer-events-none">{revealText}</Button>}
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl flex flex-col items-center justify-center p-6 text-center bg-card text-card-foreground">
          {backContent}
        </div>
      </div>
    </div>
  );
}
