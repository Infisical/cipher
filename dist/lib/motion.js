// src/lib/motion.ts
/** Millisecond mirrors of the motion tokens, for timers that wait out a motion. Guarded by motion.test.ts. */
var motionMs = {
	fast: 80,
	moderate: 160,
	slow: 240,
	exit: {
		fast: 32,
		moderate: 120,
		slow: 96
	}
};
var seconds = (ms) => ms / 1e3;
/** Enters and moves, by the size of what moves. Critically damped except the slow tier. */
var spring = {
	fast: {
		type: "spring",
		duration: seconds(motionMs.fast),
		bounce: 0
	},
	moderate: {
		type: "spring",
		duration: seconds(motionMs.moderate),
		bounce: 0
	},
	slow: {
		type: "spring",
		duration: seconds(motionMs.slow),
		bounce: .12
	}
};
/** Leaving, one tier quicker than entering. */
var exit = {
	fast: {
		type: "tween",
		duration: seconds(motionMs.exit.fast),
		ease: "easeOut"
	},
	moderate: {
		type: "tween",
		duration: seconds(motionMs.exit.moderate),
		ease: "easeOut"
	},
	slow: {
		type: "tween",
		duration: seconds(motionMs.exit.slow),
		ease: "easeOut"
	}
};
/** Opacity and color fades that carry state, so they stay when travel is reduced. */
var fade = {
	enter: {
		type: "tween",
		duration: seconds(motionMs.fast),
		ease: "easeOut"
	},
	exit: exit.fast
};
var snap = { duration: 0 };
export { exit, fade, motionMs, snap, spring };

//# sourceMappingURL=motion.js.map