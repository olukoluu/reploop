import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ViewStyle,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Colors, BorderRadius, Spacing, Typography } from '../../constants/theme';
import { Exercise } from '../../types/exercise';
import { getExerciseMedia, ExerciseMediaAsset } from '../../data/exercise-media';

interface ExerciseMediaViewProps {
  exercise: Exercise;
  style?: ViewStyle;
}

/**
 * Dedicated subcomponent for rendering local demonstration video.
 * Uses expo-video's useVideoPlayer with strict looping, muted, and autoplay configuration.
 * Automatically disposes of player when unmounted or when exercise changes.
 */
const LocalExerciseVideo: React.FC<{
  exerciseId: string;
  videoSource: NonNullable<ExerciseMediaAsset['video']>;
  exerciseName: string;
  onError: (error: any) => void;
}> = ({ exerciseId, videoSource, exerciseName, onError }) => {
  const resolvedAsset = typeof videoSource === 'number' ? Image.resolveAssetSource(videoSource) : videoSource;

  if (__DEV__) {
    console.log(`[VIDEO DEBUG] ========================================`);
    console.log(`[VIDEO DEBUG] exercise ID: ${exerciseId} (${exerciseName})`);
    console.log(`[VIDEO DEBUG] asset raw:`, videoSource);
    console.log(`[VIDEO DEBUG] asset resolved URI:`, (resolvedAsset as any)?.uri || resolvedAsset);
  }

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
    if (__DEV__) {
      console.log(`[VIDEO DEBUG] player created in setup for ${exerciseId}:`, {
        status: p.status,
        playing: p.playing,
        loop: p.loop,
        muted: p.muted,
      });
    }
  });

  // Ensure play intent and configuration on mount and update
  useEffect(() => {
    if (player) {
      player.loop = true;
      player.muted = true;
      player.play();
      if (__DEV__) {
        console.log(`[VIDEO DEBUG] player active effect for ${exerciseId}:`, {
          status: player.status,
          playing: player.playing,
          loop: player.loop,
          duration: player.duration,
        });
      }
    }
  }, [player, exerciseId]);

  // Subscribe to playback events, looping triggers, and error listeners
  useEffect(() => {
    if (!player) return;

    // 1. Explicit playToEnd listener ensuring infinite automatic looping
    const playToEndSub = player.addListener('playToEnd', () => {
      if (__DEV__) {
        console.log(`[VIDEO DEBUG] playToEnd event fired for ${exerciseId} -> looping back to start via replay()`);
      }
      player.replay();
    });

    // 2. Status change listener for readiness and fallback looping
    const statusSub = player.addListener('statusChange', ({ status, oldStatus, error }) => {
      if (__DEV__) {
        console.log(`[VIDEO DEBUG] player statusChange for ${exerciseId}:`, {
          oldStatus,
          status,
          playing: player.playing,
          error: error?.message || error,
        });
      }

      if (status === 'readyToPlay') {
        player.loop = true;
        player.muted = true;
        if (!player.playing) {
          player.play();
        }
      }

      // If playback ended and transitioned to idle, ensure it replays
      if (status === 'idle' && oldStatus === 'readyToPlay' && !error) {
        if (__DEV__) {
          console.log(`[VIDEO DEBUG] player reached end (idle from readyToPlay) for ${exerciseId} -> triggering replay()`);
        }
        player.replay();
      }

      if (status === 'error' || error) {
        console.error(`[VIDEO DEBUG] player ERROR for ${exerciseId}:`, error);
        onError(error);
      }
    });

    // 3. Playing change listener
    const playingSub = player.addListener('playingChange', ({ isPlaying, oldIsPlaying }) => {
      if (__DEV__) {
        console.log(`[VIDEO DEBUG] player playingChange for ${exerciseId}: ${oldIsPlaying} -> ${isPlaying}`);
      }
    });

    return () => {
      playToEndSub.remove();
      statusSub.remove();
      playingSub.remove();
    };
  }, [player, exerciseId, exerciseName, onError]);

  return (
    <VideoView
      player={player}
      style={styles.videoPlayer}
      contentFit="contain"
      nativeControls={false}
      fullscreenOptions={{ enable: false }}
      surfaceType={Platform.OS === 'android' ? 'textureView' : 'surfaceView'}
      useExoShutter={false}
      showsTimecodes={false}
      accessible={true}
      accessibilityLabel={`Form demonstration video for ${exerciseName}`}
      accessibilityRole="image"
    />
  );
};

/**
 * ExerciseMediaView
 * 
 * Local-first exercise demonstration component supporting two presentation states:
 * 
 * STATE A: Local Demonstration Available
 * - Plays local statically-bundled 16:9 video
 * - Autoplay, continuous infinite looping, muted (no audio)
 * - 16:9 aspect ratio, full movement visibility without cropping or stretching
 * - Rounded corners, stable layout, graceful error fallback
 * 
 * STATE B: Instructional Coaching Fallback
 * - Renders high-legibility calisthenics form cues from authoritative metadata
 * - Displays target muscles and key movement execution tips
 * - Never shows broken/empty boxes
 */
export const ExerciseMediaView: React.FC<ExerciseMediaViewProps> = ({
  exercise,
  style,
}) => {
  const [playbackError, setPlaybackError] = useState<any>(null);
  const mediaAsset = getExerciseMedia(exercise.id);

  // Reset playback error state when exercise changes
  useEffect(() => {
    setPlaybackError(null);
  }, [exercise.id]);

  const hasVideo = Boolean(mediaAsset?.video) && !playbackError;
  const hasThumbnail = Boolean(mediaAsset?.thumbnail);

  const iconName = (exercise.media?.placeholderIcon ||
    'fitness-outline') as keyof typeof Ionicons.glyphMap;

  const primaryFormCue =
    exercise.formTips?.[0] ||
    exercise.instructions?.[0] ||
    'Maintain strict form throughout the entire range of motion.';

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityLabel={`Exercise demonstration for ${exercise.name}`}
    >
      {hasVideo && mediaAsset?.video ? (
        <View style={styles.videoContainer}>
          <LocalExerciseVideo
            key={exercise.id}
            exerciseId={exercise.id}
            videoSource={mediaAsset.video}
            exerciseName={exercise.name}
            onError={(err) => setPlaybackError(err || true)}
          />
        </View>
      ) : hasThumbnail && mediaAsset?.thumbnail ? (
        <View style={styles.thumbnailContainer}>
          <Image
            source={mediaAsset.thumbnail}
            style={styles.thumbnailImage}
            resizeMode="contain"
            accessibilityLabel={`Thumbnail preview of ${exercise.name}`}
          />
        </View>
      ) : (
        /* State B: Structured Instructional Fallback */
        <View style={styles.fallbackBody}>
          <View style={styles.fallbackTop}>
            <View style={styles.iconCircle}>
              <Ionicons name={iconName} size={28} color={Colors.light.accent} />
            </View>
            <View style={styles.fallbackHeaderText}>
              <View style={styles.tagRow}>
                <View style={styles.accentDot} />
                <Text style={styles.demoTag}>COACH FORM CUES</Text>
              </View>
              <Text style={styles.targetMusclesText} numberOfLines={1}>
                {exercise.targetMuscles.join(' · ')}
              </Text>
            </View>
          </View>

          {/* Form Cue Callout */}
          <View style={styles.formCueBox}>
            <Ionicons
              name="bulb-outline"
              size={16}
              color={Colors.light.accent}
              style={{ marginTop: 2, marginRight: Spacing.xs }}
            />
            <Text style={styles.formCueText} numberOfLines={2}>
              {primaryFormCue}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: 'center',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#000000',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  thumbnailContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#000000',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  fallbackBody: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  fallbackTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  fallbackHeaderText: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  accentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.accent,
    marginRight: 6,
  },
  demoTag: {
    ...Typography.caption,
    fontSize: 10,
    letterSpacing: 1.2,
    color: Colors.light.accent,
    fontWeight: '700',
  },
  targetMusclesText: {
    ...Typography.headline,
    fontSize: 15,
    color: Colors.light.text,
  },
  formCueBox: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surfaceSubtle,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'flex-start',
  },
  formCueText: {
    ...Typography.footnote,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
