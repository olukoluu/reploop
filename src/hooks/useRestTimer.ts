import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface RestTimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isPaused: boolean;
  isActive: boolean;
  progress: number; // 0 to 1
}

interface UseRestTimerOptions {
  initialSeconds?: number;
  minSeconds?: number;
  maxSeconds?: number;
  onComplete?: () => void;
}

export function useRestTimer({
  initialSeconds = 120, // 2 minutes default from PDF
  minSeconds = 0,
  maxSeconds = 300, // up to 5 mins
  onComplete,
}: UseRestTimerOptions = {}) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const startTimestampRef = useRef<number | null>(null);
  const targetEndTimestampRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(initialSeconds);

  const start = useCallback(
    (seconds: number = initialSeconds) => {
      setTotalSeconds(seconds);
      setRemainingSeconds(seconds);
      setIsPaused(false);
      setIsActive(true);
      const now = Date.now();
      startTimestampRef.current = now;
      targetEndTimestampRef.current = now + seconds * 1000;
      pausedRemainingRef.current = seconds;
    },
    [initialSeconds]
  );

  const pause = useCallback(() => {
    if (!isActive || isPaused) return;
    setIsPaused(true);
    pausedRemainingRef.current = remainingSeconds;
    targetEndTimestampRef.current = null;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }, [isActive, isPaused, remainingSeconds]);

  const resume = useCallback(() => {
    if (!isActive || !isPaused) return;
    setIsPaused(false);
    const now = Date.now();
    targetEndTimestampRef.current = now + pausedRemainingRef.current * 1000;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }, [isActive, isPaused]);

  const addTime = useCallback(
    (secondsToAdd: number = 30) => {
      setRemainingSeconds((prev) => {
        const next = Math.min(maxSeconds, prev + secondsToAdd);
        pausedRemainingRef.current = next;
        if (targetEndTimestampRef.current) {
          targetEndTimestampRef.current += secondsToAdd * 1000;
        }
        return next;
      });
      setTotalSeconds((prev) => Math.min(maxSeconds, prev + secondsToAdd));
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    },
    [maxSeconds]
  );

  const subtractTime = useCallback(
    (secondsToSubtract: number = 30) => {
      setRemainingSeconds((prev) => {
        const next = Math.max(minSeconds, prev - secondsToSubtract);
        pausedRemainingRef.current = next;
        if (targetEndTimestampRef.current) {
          targetEndTimestampRef.current -= secondsToSubtract * 1000;
        }
        if (next <= 0) {
          setIsActive(false);
          targetEndTimestampRef.current = null;
          if (onCompleteRef.current) onCompleteRef.current();
        }
        return next;
      });
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    },
    [minSeconds]
  );

  const skip = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setRemainingSeconds(0);
    targetEndTimestampRef.current = null;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    if (onCompleteRef.current) {
      onCompleteRef.current();
    }
  }, []);

  // Wall-clock synchronization across foreground/background app state transitions
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && isActive && !isPaused && targetEndTimestampRef.current) {
        const now = Date.now();
        const diffMs = targetEndTimestampRef.current - now;
        const calcRemaining = Math.max(0, Math.ceil(diffMs / 1000));

        setRemainingSeconds(calcRemaining);

        if (calcRemaining <= 0) {
          setIsActive(false);
          targetEndTimestampRef.current = null;
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch {}
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isActive, isPaused]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      if (targetEndTimestampRef.current) {
        const now = Date.now();
        const diffMs = targetEndTimestampRef.current - now;
        const calcRemaining = Math.max(0, Math.ceil(diffMs / 1000));

        setRemainingSeconds(calcRemaining);

        if (calcRemaining <= 0) {
          clearInterval(interval);
          setIsActive(false);
          targetEndTimestampRef.current = null;
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch {}
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }
      } else {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch {}
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 1;

  const formattedTime = `${Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, '0')}:${(remainingSeconds % 60).toString().padStart(2, '0')}`;

  return {
    totalSeconds,
    remainingSeconds,
    formattedTime,
    isPaused,
    isActive,
    progress,
    start,
    pause,
    resume,
    addTime,
    subtractTime,
    skip,
  };
}

