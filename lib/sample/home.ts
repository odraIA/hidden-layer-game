import type { RoundProgressProps } from '@/components/home/RoundProgress';
import type { Rumour } from '@/components/home/RumourList';

/** The home task slot. `empty`: nothing to do right now. */
type TaskState =
  | { status: 'loading' | 'error' | 'empty' }
  | { status: 'ready'; targetName: string; deskLocation: string; hoursLeft: number; minutesLeft: number };

/**
 * Made-up data for the M0 sample screen. Nothing here comes from a server.
 * Delete this file when the home screen reads real round state (M3 to M5).
 */
export const sampleHome: { round: RoundProgressProps; task: TaskState; rumours: Rumour[] } = {
  round: { status: 'ready', roundNumber: 4, hidesDone: 7, hidesTotal: 16 },
  task: {
    status: 'ready',
    targetName: 'Ada',
    deskLocation: 'Despacho 2.14, la mesa junto a la ventana',
    hoursLeft: 5,
    minutesLeft: 20,
  },
  rumours: [
    { id: 'sample-1', kind: 'found', hiddenFor: { days: 1, hours: 3, minutes: 0 } },
    { id: 'sample-2', kind: 'undetectable' },
    { id: 'sample-3', kind: 'found', hiddenFor: { days: 0, hours: 0, minutes: 40 } },
  ] satisfies Rumour[],
};
