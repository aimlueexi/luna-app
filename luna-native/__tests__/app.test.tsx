import { fireEvent, render } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';
import App from '../App';

jest.mock('expo-video', () => ({
  useVideoPlayer: jest.fn(),
  VideoView: () => null,
}));

describe('Luna native app', () => {
  it('shows the featured film on the home screen', async () => {
    const { getByText } = await render(<App />);

    expect(getByText('月球之外')).toBeTruthy();
    expect(getByText('继续观看')).toBeTruthy();
  });

  it('filters titles from the search screen', async () => {
    const { getByText, getByLabelText, queryByText } = await render(<App />);
    await fireEvent.press(getByText('探索'));
    await fireEvent.changeText(getByLabelText('搜索影片、演员或类型'), '雾中来信');

    expect(getByText('雾中来信')).toBeTruthy();
    expect(queryByText('最后一场日落')).toBeNull();
  });
});
