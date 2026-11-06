import { fireEvent, render, screen } from '@testing-library/react-native';
import App from '../App';

jest.mock('expo-video', () => ({
  useVideoPlayer: jest.fn(),
  VideoView: () => null,
}));

describe('Luna native app', () => {
  it('shows the featured film on the home screen', () => {
    render(<App />);

    expect(screen.getByText('月球之外')).toBeTruthy();
    expect(screen.getByText('继续观看')).toBeTruthy();
  });

  it('filters titles from the search screen', () => {
    render(<App />);
    fireEvent.press(screen.getByText('探索'));
    fireEvent.changeText(screen.getByLabelText('搜索影片、演员或类型'), '雾中来信');

    expect(screen.getByText('雾中来信')).toBeTruthy();
    expect(screen.queryByText('最后一场日落')).toBeNull();
  });
});
