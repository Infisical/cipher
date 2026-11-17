/** Millisecond mirrors of the motion tokens, for timers that wait out a motion. Guarded by motion.test.ts. */
export declare const motionMs: {
    readonly fast: 80;
    readonly moderate: 160;
    readonly slow: 240;
    readonly exit: {
        readonly fast: 32;
        readonly moderate: 120;
        readonly slow: 96;
    };
};
/** Enters and moves, by the size of what moves. Critically damped except the slow tier. */
export declare const spring: {
    readonly fast: {
        readonly type: "spring";
        readonly duration: number;
        readonly bounce: 0;
    };
    readonly moderate: {
        readonly type: "spring";
        readonly duration: number;
        readonly bounce: 0;
    };
    readonly slow: {
        readonly type: "spring";
        readonly duration: number;
        readonly bounce: 0.12;
    };
};
/** Leaving, one tier quicker than entering. */
export declare const exit: {
    readonly fast: {
        readonly type: "tween";
        readonly duration: number;
        readonly ease: "easeOut";
    };
    readonly moderate: {
        readonly type: "tween";
        readonly duration: number;
        readonly ease: "easeOut";
    };
    readonly slow: {
        readonly type: "tween";
        readonly duration: number;
        readonly ease: "easeOut";
    };
};
/** Opacity and color fades that carry state, so they stay when travel is reduced. */
export declare const fade: {
    readonly enter: {
        readonly type: "tween";
        readonly duration: number;
        readonly ease: "easeOut";
    };
    readonly exit: {
        readonly type: "tween";
        readonly duration: number;
        readonly ease: "easeOut";
    };
};
export declare const snap: {
    readonly duration: 0;
};
