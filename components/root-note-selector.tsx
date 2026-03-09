'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { noteToFixedSolfege, CHROMATIC_NOTES, NotationType } from '@/lib/music-utils'

interface RootNoteSelectorProps {
  rootNote: string
  onRootNoteChange: (note: string) => void
  notationType: NotationType
}

export function RootNoteSelector({
  rootNote,
  onRootNoteChange,
  notationType,
}: RootNoteSelectorProps) {
  const getDisplayNote = (note: string) => {
    if (notationType === 'syllabic') {
      return noteToFixedSolfege(note)
    }
    return note
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CHROMATIC_NOTES.map(note => (
        <Button
          key={note}
          variant={rootNote === note ? 'default' : 'outline'}
          size="sm"
          onClick={() => onRootNoteChange(note)}
          className={cn(
            'min-w-[3rem] transition-all',
            rootNote === note &&
              'bg-accent-orange text-background hover:bg-accent-orange/90'
          )}
        >
          {getDisplayNote(note)}
        </Button>
      ))}
    </div>
  )
}
