import { Exercise } from '../types/exercise';

export const EXERCISES: Record<string, Exercise> = {
  diamond_pushups: {
    id: 'diamond_pushups',
    name: 'Diamond Push-ups',
    description: 'A close-grip push-up variation with hands forming a diamond shape, heavily emphasizing the triceps and inner chest.',
    targetMuscles: ['Triceps', 'Chest', 'Front Delts'],
    muscleGroups: ['triceps', 'chest', 'front_delts'],
    instructions: [
      'Place hands together under your chest with thumbs and index fingers touching in a diamond shape.',
      'Maintain a rigid plank posture with core and glutes engaged.',
      'Lower your chest until it nearly touches your hands, keeping elbows close to your torso.',
      'Push forcefully back up to full extension without locking elbows violently.',
    ],
    formTips: [
      'Keep your core tightly braced—avoid sagging hips.',
      'Keep elbows tracking back at roughly a 45-degree angle.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'triangle-outline',
    },
  },
  regular_pushups: {
    id: 'regular_pushups',
    name: 'Regular Push-ups',
    description: 'Classic horizontal pressing movement targeting the pectoral muscles, anterior deltoids, and triceps.',
    targetMuscles: ['Chest', 'Triceps', 'Front Delts'],
    muscleGroups: ['chest', 'triceps', 'front_delts'],
    instructions: [
      'Position hands shoulder-width apart on the floor with feet together.',
      'Maintain a straight line from heels through head.',
      'Lower chest under control until 1-2 inches above the ground.',
      'Drive through your palms to return to the top position.',
    ],
    formTips: [
      'Do not flare elbows out at 90 degrees; keep them tucked at ~45 degrees.',
      'Work every set till failure with controlled tempo.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'barbell-outline',
    },
  },
  chair_dips: {
    id: 'chair_dips',
    name: 'Chair Dips',
    description: 'Bodyweight dips performed using a sturdy chair or bench to isolate triceps and anterior deltoids.',
    targetMuscles: ['Triceps', 'Front Delts', 'Lower Chest'],
    muscleGroups: ['triceps', 'front_delts', 'chest'],
    equipmentNeeded: ['chair'],
    instructions: [
      'Sit on the edge of a sturdy chair, gripping the edge next to your hips.',
      'Slide your hips forward off the chair with legs extended out front.',
      'Bend elbows to lower your body until upper arms are nearly parallel to the floor (90 degrees).',
      'Push down through your palms to return to the starting locked position.',
    ],
    formTips: [
      'Keep your back close to the edge of the chair throughout.',
      'Avoid dipping too deep if you feel excessive shoulder strain.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'cube-outline',
    },
  },
  wide_arm_pushups: {
    id: 'wide_arm_pushups',
    name: 'Wide-Arm Push-ups',
    description: 'Push-up variation with wider hand placement to maximize pectoral stretch and activation.',
    targetMuscles: ['Chest', 'Front Delts', 'Triceps'],
    muscleGroups: ['chest', 'front_delts', 'triceps'],
    instructions: [
      'Place hands noticeably wider than shoulder-width (approx. 1.5x shoulder width).',
      'Keep core braced and body straight.',
      'Lower your chest smoothly until you feel a deep stretch across the chest.',
      'Push up firmly back to start position.',
    ],
    formTips: [
      'Focus on squeezing your chest muscles at the peak of the contraction.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'expand-outline',
    },
  },
  incline_pushups: {
    id: 'incline_pushups',
    name: 'Incline Push-ups',
    description: 'Push-ups with hands elevated on a chair or platform, targeting the lower pectoral fibers as a burnout.',
    targetMuscles: ['Lower Chest', 'Triceps', 'Front Delts'],
    muscleGroups: ['chest', 'triceps', 'front_delts'],
    equipmentNeeded: ['chair'],
    instructions: [
      'Place your hands shoulder-width apart on a sturdy chair, sofa, or elevated ledge.',
      'Keep your body in a straight plank line.',
      'Lower your chest towards the elevated surface.',
      'Press through your hands until arms are fully extended.',
    ],
    formTips: [
      'Excellent exercise to push beyond failure after standard push-up variations.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'trending-up-outline',
    },
  },
  lateral_raises: {
    id: 'lateral_raises',
    name: 'Lateral Raises',
    description: 'Targeted shoulder abduction movement isolating the lateral head of the deltoids for wider shoulders.',
    targetMuscles: ['Side Delts', 'Rear Delts'],
    muscleGroups: ['side_delts', 'rear_delts'],
    equipmentNeeded: ['school_bag'],
    instructions: [
      'Stand upright with feet hip-width apart, holding small weights or light resistance (e.g. bottles or bag).',
      'With a slight bend in the elbows, raise your arms out to the sides until parallel to the floor.',
      'Pause briefly at the top with elbows slightly higher than wrists.',
      'Lower under control.',
    ],
    formTips: [
      'Lead with your elbows, not your hands. Avoid shrugging your traps.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'analytics-outline',
    },
  },
  towel_back_extension: {
    id: 'towel_back_extension',
    name: 'Towel Back Extension',
    description: 'Prone back extension using tension on a towel to activate the spinal erectors, lats, and posterior chain.',
    targetMuscles: ['Lower Back', 'Upper Back', 'Lats'],
    muscleGroups: ['back'],
    equipmentNeeded: ['towel'],
    instructions: [
      'Lie face down on the floor holding a towel taut with both hands extended overhead.',
      'Pull the towel outwards continuously to generate lat and upper back tension.',
      'Simultaneously lift your chest and arms off the floor by contracting your back.',
      'Hold the peak contraction for 1 second, then lower slowly.',
    ],
    formTips: [
      'Keep continuous outward tension on the towel throughout the full range of motion.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'layers-outline',
    },
  },
  superman_pullback: {
    id: 'superman_pullback',
    name: 'Superman Pullback',
    description: 'Prone posture exercise focusing on the rhomboids, rear delts, and mid-back without equipment.',
    targetMuscles: ['Upper Back', 'Rear Delts', 'Rhomboids'],
    muscleGroups: ['back', 'rear_delts'],
    instructions: [
      'Lie face down on the floor with arms extended straight overhead.',
      'Lift your chest and thighs slightly off the ground.',
      'Draw your elbows back toward your hips in a rowing motion, squeezing your shoulder blades together.',
      'Extend arms back out front and repeat for maximum failure reps.',
    ],
    formTips: [
      'Focus entirely on the shoulder blade squeeze at the retracted position.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'airplane-outline',
    },
  },
  table_pullups: {
    id: 'table_pullups',
    name: 'Table Pull-ups (Inverted Row)',
    description: 'Horizontal bodyweight row performed under a sturdy table to build back thickness and bicep strength.',
    targetMuscles: ['Lats', 'Upper Back', 'Biceps'],
    muscleGroups: ['back', 'biceps'],
    equipmentNeeded: ['table'],
    instructions: [
      'Lie on the floor under a strong, heavy table with chest aligned with the table edge.',
      'Grip the sturdy edge with hands wider than shoulder-width.',
      'Keep heels on floor and body straight like a reverse plank.',
      'Pull your chest up toward the table edge, squeezing your back.',
      'Lower with control until arms are extended.',
    ],
    formTips: [
      'Ensure table is completely stable and cannot tip. Keep body rigid.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'tablet-landscape-outline',
    },
  },
  school_bag_bicep_curls: {
    id: 'school_bag_bicep_curls',
    name: 'School Bag Bicep Curls',
    description: 'Bicep curls using a loaded backpack or school bag as home resistance.',
    targetMuscles: ['Biceps', 'Forearms'],
    muscleGroups: ['biceps'],
    equipmentNeeded: ['school_bag'],
    instructions: [
      'Stand tall, holding a weighted backpack by its top handle or shoulder straps.',
      'Pin your elbows to your sides.',
      'Curl the bag upward by flexing your biceps until fully contracted.',
      'Lower under complete control back to arms-straight position.',
    ],
    formTips: [
      'Do not swing your torso or use momentum. Isolate the biceps.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'briefcase-outline',
    },
  },
  pull_ups: {
    id: 'pull_ups',
    name: 'Pull-ups',
    description: 'Overhand grip vertical pull for ultimate back width, lat development, and upper body strength.',
    targetMuscles: ['Lats', 'Upper Back', 'Biceps', 'Rear Delts'],
    muscleGroups: ['back', 'biceps', 'rear_delts'],
    equipmentNeeded: ['pull_up_bar'],
    instructions: [
      'Grip the pull-up bar with an overhand (pronated) grip slightly wider than shoulder-width.',
      'Start from a dead hang with arms fully extended.',
      'Pull yourself up until your chin clears the bar, driving elbows down and back.',
      'Lower smoothly back to the full dead hang.',
    ],
    formTips: [
      'Avoid swinging or kicking legs. Maintain tight abdominal tension.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'git-commit-outline',
    },
  },
  chin_ups: {
    id: 'chin_ups',
    name: 'Chin-ups',
    description: 'Underhand grip vertical pull emphasizing the biceps along with the lats.',
    targetMuscles: ['Biceps', 'Lats', 'Upper Back'],
    muscleGroups: ['biceps', 'back'],
    equipmentNeeded: ['pull_up_bar'],
    instructions: [
      'Grip the pull-up bar with an underhand (supinated) grip shoulder-width apart.',
      'Hang with full arm extension.',
      'Pull yourself up smoothly until chin is cleanly over the bar.',
      'Lower with control back to the starting hang.',
    ],
    formTips: [
      'Keep shoulders depressed (down away from ears) throughout.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'git-network-outline',
    },
  },
  lunges: {
    id: 'lunges',
    name: 'Lunges (Warm-up)',
    description: 'Dynamic unilateral leg exercise to activate the hip flexors, quads, and glutes.',
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings'],
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    instructions: [
      'Step forward with one leg, lowering your hips until both knees are bent at 90 degrees.',
      'The back knee should hover just above the floor.',
      'Push through the front heel to return to standing, then alternate legs.',
    ],
    formTips: [
      'Keep torso upright and front knee directly over the ankle.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'walk-outline',
    },
  },
  squats: {
    id: 'squats',
    name: 'Squats',
    description: 'Fundamental bodyweight lower-body compound movement for quadriceps, hamstrings, and glutes.',
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings', 'Calves'],
    muscleGroups: ['quads', 'glutes', 'hamstrings', 'calves'],
    instructions: [
      'Stand with feet slightly wider than shoulder-width, toes turned slightly out.',
      'Send hips back and bend knees, keeping chest lifted and spine neutral.',
      'Descend until thighs are at least parallel to the floor.',
      'Drive through mid-foot and heels to return to standing.',
    ],
    formTips: [
      'Work every set till failure! Keep knees tracking inline with toes.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'body-outline',
    },
  },
  split_squats: {
    id: 'split_squats',
    name: 'Split Squats',
    description: 'Stationary unilateral lunge focusing intensive load on each quad and glute independently.',
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings'],
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    instructions: [
      'Adopt a staggered split stance with one foot forward and one back.',
      'Lower straight down by bending both knees until back knee is just above the floor.',
      'Push through front heel to return to top without moving your foot placement.',
      'Complete reps on one leg till failure, then switch to the other leg.',
    ],
    formTips: [
      'Keep weight centered through the front foot heel and midfoot.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'fitness-outline',
    },
  },
  calves_raises: {
    id: 'calves_raises',
    name: 'Calf Raises',
    description: 'Plantar flexion exercise isolating the gastrocnemius and soleus calf muscles.',
    targetMuscles: ['Calves'],
    muscleGroups: ['calves'],
    instructions: [
      'Stand upright on the edge of a step or flat ground with feet hip-width apart.',
      'Rise up onto the balls of your feet as high as possible, squeezing calves hard.',
      'Hold the peak contraction for 1 second.',
      'Lower slowly below the level of the step (or flat floor) for a deep stretch.',
    ],
    formTips: [
      'Do not bounce; control the descent and emphasize the stretch.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'footsteps-outline',
    },
  },
  walking_lunges: {
    id: 'walking_lunges',
    name: 'Walking Lunges',
    description: 'Continuous forward lunging movement creating immense quadricep, hamstring, and glute burn.',
    targetMuscles: ['Glutes', 'Quads', 'Hamstrings'],
    muscleGroups: ['glutes', 'quads', 'hamstrings'],
    instructions: [
      'Step forward into a lunge with your right leg.',
      'Lower hips to 90 degrees, then drive up through right foot directly into a forward step with the left leg.',
      'Continue stepping continuously forward until muscular failure.',
    ],
    formTips: [
      'Maintain an upright posture throughout the entire walk.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'walk-outline',
    },
  },
  knee_pushups: {
    id: 'knee_pushups',
    name: 'Knee Push-ups (Warm-up)',
    description: 'Modified push-up performed on knees for joint warm-up and chest/shoulder activation.',
    targetMuscles: ['Chest', 'Triceps', 'Front Delts'],
    muscleGroups: ['chest', 'triceps', 'front_delts'],
    instructions: [
      'Position knees on floor with hips extended and hands shoulder-width apart.',
      'Lower chest towards floor under control.',
      'Push up back to full arm extension.',
    ],
    formTips: [
      'Perform warm-up reps with smooth, rhythmic tempo to prepare joints.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'barbell-outline',
    },
  },
  abs_crunches: {
    id: 'abs_crunches',
    name: 'Abs Crunches',
    description: 'Controlled spinal flexion isolating the rectus abdominis.',
    targetMuscles: ['Upper Abs', 'Core'],
    muscleGroups: ['abs'],
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor.',
      'Place fingertips lightly behind your ears or across chest.',
      'Curl your upper torso off the ground by contracting your abdominal muscles.',
      'Exhale and squeeze at the top, then lower with control.',
    ],
    formTips: [
      'Do not yank your neck with your hands. Lead the movement from the core.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'flash-outline',
    },
  },
  russian_twist: {
    id: 'russian_twist',
    name: 'Russian Twist',
    description: 'Rotational core exercise developing oblique strength and rotational stability.',
    targetMuscles: ['Obliques', 'Abs'],
    muscleGroups: ['abs'],
    instructions: [
      'Sit on the floor with knees bent, leaning torso back at a 45-degree angle.',
      'Elevate feet slightly for greater difficulty or keep heels lightly on floor.',
      'Rotate your torso from side to side, touching the floor on each side.',
    ],
    formTips: [
      'Rotate your entire ribcage and shoulders, not just your arms.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'sync-outline',
    },
  },
  leg_raises: {
    id: 'leg_raises',
    name: 'Leg Raises',
    description: 'Lower abdominal isolation exercise lifting straight legs from a supine position.',
    targetMuscles: ['Lower Abs', 'Hip Flexors'],
    muscleGroups: ['abs'],
    instructions: [
      'Lie flat on your back with hands along sides or slightly under glutes for lower back support.',
      'Keep legs straight and raise them up until they are perpendicular to the floor (90 degrees).',
      'Lower legs slowly until heels are hovering just above the floor without arching lower back.',
    ],
    formTips: [
      'Press your lower back firmly into the floor throughout the entire movement.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'arrow-up-outline',
    },
  },
  knee_tucks: {
    id: 'knee_tucks',
    name: 'Knee Tucks',
    description: 'Dynamic core flexion drawing knees in toward the chest to finish the abdominal sequence.',
    targetMuscles: ['Lower Abs', 'Full Core'],
    muscleGroups: ['abs'],
    instructions: [
      'Sit on the floor leaning back slightly on your hands.',
      'Extend legs straight out hovering off the ground.',
      'Simultaneously pull knees in toward your chest while crunching torso forward.',
      'Extend legs back out under control.',
    ],
    formTips: [
      'Focus on full contraction and deep stretch on every single rep till failure.',
    ],
    media: {
      type: 'placeholder',
      placeholderIcon: 'contract-outline',
    },
  },
};

