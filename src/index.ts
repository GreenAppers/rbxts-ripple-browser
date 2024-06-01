import React from "@rbxts/react";

export type Cleanup = () => void;

export interface SpringOptions {
  readonly damping?: number;
  readonly frequency?: number;
  readonly mass?: number;
  readonly tension?: number;
  readonly friction?: number;
  readonly position?: number;
  readonly velocity?: number;
  readonly impulse?: number;
  readonly restingVelocity?: number;
  readonly restingPosition?: number;
}

export interface LinearOptions {
  readonly speed?: number;
}

export type MotionGoal =
  | { [key: string | number]: number }
  | number[]
  | number
  | UDim2
  | UDim
  | Vector2
  | Vector3
  | Color3
  | CFrame;

interface Disconnectable {
  Disconnect(): void;
}

interface Heartbeat {
  Connect(callback: (deltaTime: number) => void): Disconnectable;
}

type MapSolvers<T extends PartialMotionGoal> = T extends number[]
  ? {
      [K in keyof T]?: T[K] extends number | undefined
        ? MotionSolver<number>
        : T[K];
    }
  : T extends { [key: string | number]: number }
  ? {
      [K in keyof T]?: T[K] extends number | undefined
        ? MotionSolver<number>
        : T[K];
    }
  : MotionSolver<T>;

type MapGoalTo<T extends MotionGoal, U> = T extends number[]
  ? {
      [K in keyof T]: T[K] extends number ? U : T[K];
    }
  : T extends { [key: string | number]: number }
  ? {
      [K in keyof T]: T[K] extends number ? U : T[K];
    }
  : U[]; // internal intermediate values for datatypes

interface MotionOptions {
  readonly heartbeat?: Heartbeat;
  readonly start?: boolean;
}

interface MotionState {
  value: number;
  complete: boolean;
  velocity?: number;
  destructor?: Cleanup;
}

type MotionSolver<T extends PartialMotionGoal> = ((
  key: string,
  state: MotionState,
  deltaTime: number
) => void) & {
  /**
   * @deprecated Reserved for internal use
   */
  __type: T;
};

type PartialMotionGoal<T extends MotionGoal = MotionGoal> = T extends
  | number[]
  | { [key: string | number]: number }
  ? Partial<T>
  : T;

interface TweenOptions {
  readonly time?: number;
  readonly style?: Enum.EasingStyle;
  readonly direction?: Enum.EasingDirection;
  readonly repeatCount?: number;
  readonly reverses?: boolean;
  readonly delayTime?: number;
}

export class Motion<T extends MotionGoal = number> {
  constructor(public initialValue: T, public options?: MotionOptions) {}

  start(): Cleanup {
    return () => {};
  }

  stop(): void {}

  get(): T {
    return this.initialValue;
  }

  getVelocity(): T {
    return this.initialValue;
  }

  set(value: PartialMotionGoal<T>): void {}

  impulse(velocity: PartialMotionGoal<T>): void {}

  to(solver: MotionSolver<T> | MapSolvers<PartialMotionGoal<T>>): void {}

  immediate(goal: PartialMotionGoal<T>): void {}

  linear(goal: PartialMotionGoal<T>, options?: LinearOptions): void {}

  spring(goal: PartialMotionGoal<T>, options?: SpringOptions): void {}

  tween(goal: PartialMotionGoal<T>, options?: TweenOptions): void {}

  step(deltaTime: number): T {
    return this.initialValue;
  }

  isComplete(): boolean {
    return false;
  }

  onComplete(callback: (value: T) => void): Cleanup {
    return () => {};
  }

  onStep(callback: (value: T, deltaTime: number) => void): Cleanup {
    return () => {};
  }

  patch(source: Partial<MapGoalTo<T, Partial<MotionState>>>): void {}

  destroy(): void {}
}

function createMotion<T extends MotionGoal>(
  initialValue: T,
  options?: MotionOptions
): Motion<T> {
  return new Motion<T>(initialValue, options);
}

export const config = {
  spring: {
    default: { tension: 170, friction: 26 },
    gentle: { tension: 120, friction: 14 },
    wobbly: { tension: 180, friction: 12 },
    stiff: { tension: 210, friction: 20 },
    slow: { tension: 280, friction: 60 },
    molasses: { tension: 280, friction: 120 },
  },

  linear: {
    default: { speed: 1 },
  },

  tween: {
    default: {
      time: 1,
      style: Enum.EasingStyle.Quad,
      direction: Enum.EasingDirection.Out,
      repeatCount: 0,
      reverses: false,
      delayTime: 0,
    },
  },
};
