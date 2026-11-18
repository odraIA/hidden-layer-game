import { fireEvent } from '@testing-library/react-native';
import { renderRouter, screen } from 'expo-router/testing-library';

import HomeScreen from '@/app/(player)/index';
import i18n from '@/i18n';

const t = i18n.t;
const open = (url: string) => renderRouter({ index: HomeScreen }, { initialUrl: url });

beforeAll(() => i18n.changeLanguage('es'));

describe('home screen states (antislop R-27)', () => {
  it('ready: round, hide task and rumours; the photo button explains the camera is pending', async () => {
    await open('/');
    expect(screen.getByText(t('home.round.title', { number: 4 }))).toBeVisible();
    expect(screen.getByText(t('home.hide.title'))).toBeVisible();
    expect(screen.getByText(t('home.rumours.undetectable'))).toBeVisible();
    expect(screen.queryByText(t('sample.cameraPending'))).toBeNull();

    await fireEvent.press(screen.getByText(t('home.hide.cta')));
    expect(screen.getByText(t('sample.cameraPending'))).toBeVisible();
  });

  it('loading: every block says what it is loading', async () => {
    await open('/?state=loading');
    expect(screen.getByText(t('home.round.loading'))).toBeVisible();
    expect(screen.getByText(t('home.task.loading'))).toBeVisible();
    expect(screen.getByText(t('home.rumours.loading'))).toBeVisible();
    expect(screen.queryByText(t('home.hide.title'))).toBeNull();
  });

  it('error: every block says what failed, and retry brings the data back', async () => {
    await open('/?state=error');
    expect(screen.getByText(t('home.round.error'))).toBeVisible();
    expect(screen.getByText(t('home.task.error'))).toBeVisible();
    expect(screen.getByText(t('home.rumours.error'))).toBeVisible();

    await fireEvent.press(screen.getAllByText(t('common.retry'))[0]);
    expect(screen.getByText(t('home.hide.title'))).toBeVisible();
    expect(screen.queryByText(t('home.round.error'))).toBeNull();
  });

  it('empty: no round, nothing to do, no rumours', async () => {
    await open('/?state=empty');
    expect(screen.getByText(t('home.round.empty'))).toBeVisible();
    expect(screen.getByText(t('home.task.empty'))).toBeVisible();
    expect(screen.getByText(t('home.rumours.empty'))).toBeVisible();
  });

  it('an unknown state falls back to ready', async () => {
    await open('/?state=banana');
    expect(screen.getByText(t('home.hide.title'))).toBeVisible();
  });
});
