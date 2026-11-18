import type { RoundProgressProps } from '@/components/home/RoundProgress';
import type { Rumour } from '@/components/home/RumourList';

/** The home task slot. `empty`: nothing to do right now. */
export type TaskState =
  | { status: 'loading' | 'error' | 'empty' }
  | { status: 'ready'; targetName: string; deskLocation: string; hoursLeft: number; minutesLeft: number };

export const SAMPLE_STATES = ['ready', 'loading', 'error', 'empty'] as const;
export type SampleState = (typeof SAMPLE_STATES)[number];

type SampleHome = {
  round: RoundProgressProps;
  task: TaskState;
  rumours: { status: 'loading' | 'error' | 'ready'; items: Rumour[] };
};

/**
 * Made-up data for the M0 sample screen, in any of the four states so tests
 * and screenshots can reach each one. Nothing here comes from a server.
 * Delete this file when the home screen reads real round state (M3 to M5).
 */
export function sampleHome(state: SampleState, onRetry: () => void): SampleHome {
  if (state === 'loading') {
    return { round: { status: 'loading' }, task: { status: 'loading' }, rumours: { status: 'loading', items: [] } };
  }
  if (state === 'error') {
    return { round: { status: 'error', onRetry }, task: { status: 'error' }, rumours: { status: 'error', items: [] } };
  }
  if (state === 'empty') {
    return { round: { status: 'empty' }, task: { status: 'empty' }, rumours: { status: 'ready', items: [] } };
  }
  return {
    round: { status: 'ready', roundNumber: 4, hidesDone: 7, hidesTotal: 16 },
    task: {
      status: 'ready',
      targetName: 'Ada',
      deskLocation: 'Despacho 2.14, la mesa junto a la ventana',
      hoursLeft: 5,
      minutesLeft: 20,
    },
    rumours: {
      status: 'ready',
      items: [
        { id: 'sample-1', kind: 'found', hiddenFor: { days: 1, hours: 3, minutes: 0 } },
        { id: 'sample-2', kind: 'undetectable' },
        { id: 'sample-3', kind: 'found', hiddenFor: { days: 0, hours: 0, minutes: 40 } },
      ],
    },
  };
}
