describe('Rest Timer Mathematics & Boundary Rules', () => {
  const calculateNextRemaining = (
    currentRemaining: number,
    delta: number,
    min: number = 0,
    max: number = 300
  ) => {
    return Math.max(min, Math.min(max, currentRemaining + delta));
  };

  const formatRemaining = (remainingSeconds: number) => {
    const mins = Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (remainingSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  test('Calculates time addition (+30s) within upper bound', () => {
    expect(calculateNextRemaining(120, 30)).toBe(150);
    expect(calculateNextRemaining(290, 30, 0, 300)).toBe(300);
  });

  test('Calculates time subtraction (-30s) without negative values', () => {
    expect(calculateNextRemaining(120, -30)).toBe(90);
    expect(calculateNextRemaining(20, -30, 0, 300)).toBe(0);
  });

  test('Formats MM:SS timestamps correctly', () => {
    expect(formatRemaining(120)).toBe('02:00');
    expect(formatRemaining(95)).toBe('01:35');
    expect(formatRemaining(5)).toBe('00:05');
    expect(formatRemaining(0)).toBe('00:00');
  });
});

