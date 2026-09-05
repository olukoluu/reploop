import { generateWorkoutSteps } from "../src/data/program";
import { FlattenedWorkoutStep } from "../src/types/session";

describe("Up Next Step Resolution & Workout Flow Logic", () => {
  // Helper simulating the step progression lifecycle in active workout
  const simulateWorkoutProgression = (steps: FlattenedWorkoutStep[]) => {
    let currentStepIndex = 0;

    const getCurrentActiveStep = () => steps[currentStepIndex];

    const logCurrentSetAndEnterRest = (reps: number) => {
      const completedStep = steps[currentStepIndex];
      const nextStepIndex = currentStepIndex + 1;
      const isWorkoutComplete = nextStepIndex >= steps.length;

      currentStepIndex = nextStepIndex;

      // During rest timer, the Up Next card displays the step at currentStepIndex
      const upNextStep = isWorkoutComplete ? null : steps[currentStepIndex];

      return {
        completedStep,
        isWorkoutComplete,
        upNextStep,
      };
    };

    return {
      getCurrentActiveStep,
      logCurrentSetAndEnterRest,
    };
  };

  test("Exercise with 2 sets: accurately displays Up Next Set 2 during rest, then transitions to next exercise", () => {
    // Day 1 Push Day:
    // Step 0: Warmup diamond_pushups Set 1 of 2
    // Step 1: Warmup diamond_pushups Set 2 of 2
    // Step 2: Main regular_pushups Set 1 of 2
    // Step 3: Main regular_pushups Set 2 of 2
    const steps = generateWorkoutSteps(1, ["chair"]);
    const sim = simulateWorkoutProgression(steps);

    // Initial state: Step 0 active (Diamond pushups Warm-up Set 1 of 2)
    const initialStep = sim.getCurrentActiveStep();
    expect(initialStep.exerciseId).toBe("diamond_pushups");
    expect(initialStep.setNumber).toBe(1);
    expect(initialStep.totalSets).toBe(2);
    expect(initialStep.isWarmup).toBe(true);

    // Complete Set 1 -> Rest begins -> Up Next must be Diamond pushups Set 2 of 2
    const rest1 = sim.logCurrentSetAndEnterRest(5);
    expect(rest1.isWorkoutComplete).toBe(false);
    expect(rest1.upNextStep).not.toBeNull();
    expect(rest1.upNextStep?.exerciseId).toBe("diamond_pushups");
    expect(rest1.upNextStep?.setNumber).toBe(2);
    expect(rest1.upNextStep?.totalSets).toBe(2);
    expect(rest1.upNextStep?.isWarmup).toBe(true);

    // Complete Set 2 (Warmup complete) -> Rest begins -> Up Next must be Regular pushups Set 1 of 2
    const rest2 = sim.logCurrentSetAndEnterRest(5);
    expect(rest2.isWorkoutComplete).toBe(false);
    expect(rest2.upNextStep?.exerciseId).toBe("regular_pushups");
    expect(rest2.upNextStep?.setNumber).toBe(1);
    expect(rest2.upNextStep?.totalSets).toBe(2);
    expect(rest2.upNextStep?.isWarmup).toBe(false);

    // Complete Regular pushups Set 1 -> Rest begins -> Up Next must be Regular pushups Set 2 of 2
    const rest3 = sim.logCurrentSetAndEnterRest(15);
    expect(rest3.isWorkoutComplete).toBe(false);
    expect(rest3.upNextStep?.exerciseId).toBe("regular_pushups");
    expect(rest3.upNextStep?.setNumber).toBe(2);
    expect(rest3.upNextStep?.totalSets).toBe(2);
  });

  test("Exercise with 3+ sets (Squats): verifies middle set progression and final set transition", () => {
    // Day 3 Leg Day has Squats (3 sets) as first main exercise
    const steps = generateWorkoutSteps(3, []);
    const sim = simulateWorkoutProgression(steps);

    // Skip past warmups (Lunges 2 sets)
    sim.logCurrentSetAndEnterRest(10); // Warmup set 1
    sim.logCurrentSetAndEnterRest(10); // Warmup set 2 -> Up next is Squats Set 1 of 3

    expect(sim.getCurrentActiveStep().exerciseId).toBe("squats");
    expect(sim.getCurrentActiveStep().setNumber).toBe(1);
    expect(sim.getCurrentActiveStep().totalSets).toBe(3);

    // Log Squats Set 1 -> Up Next: Squats Set 2 of 3
    const restSquats1 = sim.logCurrentSetAndEnterRest(20);
    expect(restSquats1.upNextStep?.exerciseId).toBe("squats");
    expect(restSquats1.upNextStep?.setNumber).toBe(2);
    expect(restSquats1.upNextStep?.totalSets).toBe(3);

    // Log Squats Set 2 (middle set) -> Up Next: Squats Set 3 of 3
    const restSquats2 = sim.logCurrentSetAndEnterRest(20);
    expect(restSquats2.upNextStep?.exerciseId).toBe("squats");
    expect(restSquats2.upNextStep?.setNumber).toBe(3);
    expect(restSquats2.upNextStep?.totalSets).toBe(3);

    // Log Squats Set 3 (final set of squats) -> Up Next: Split Squats Set 1 of 2
    const restSquats3 = sim.logCurrentSetAndEnterRest(20);
    expect(restSquats3.upNextStep?.exerciseId).toBe("split_squats");
    expect(restSquats3.upNextStep?.setNumber).toBe(1);
    expect(restSquats3.upNextStep?.totalSets).toBe(2);
  });

  test("Final workout item: completes session cleanly without entering rest or showing impossible set", () => {
    const steps = generateWorkoutSteps(1, ["chair"]);
    const sim = simulateWorkoutProgression(steps);

    // Fast-forward to second-to-last step
    for (let i = 0; i < steps.length - 1; i++) {
      sim.logCurrentSetAndEnterRest(15);
    }

    // Now on final step of workout
    const finalStep = sim.getCurrentActiveStep();
    expect(finalStep).toBe(steps[steps.length - 1]);

    // Log final set
    const finish = sim.logCurrentSetAndEnterRest(15);
    expect(finish.isWorkoutComplete).toBe(true);
    expect(finish.upNextStep).toBeNull();
  });

  test("Never produces impossible set numbers (Set 0, Set 3 of 2, etc.)", () => {
    const steps = generateWorkoutSteps(2, ["pull_up_bar"]);
    const sim = simulateWorkoutProgression(steps);

    for (let i = 0; i < steps.length; i++) {
      const active = sim.getCurrentActiveStep();
      expect(active.setNumber).toBeGreaterThanOrEqual(1);
      expect(active.setNumber).toBeLessThanOrEqual(active.totalSets);

      const res = sim.logCurrentSetAndEnterRest(12);
      if (!res.isWorkoutComplete && res.upNextStep) {
        expect(res.upNextStep.setNumber).toBeGreaterThanOrEqual(1);
        expect(res.upNextStep.setNumber).toBeLessThanOrEqual(res.upNextStep.totalSets);
      }
    }
  });
});

