import * as React from "react";
// src/lib/use-option-creation.ts
function useOptionCreation(onCreate, onSuccess) {
	const [creating, setCreating] = React.useState(false);
	const [error, setError] = React.useState("");
	const generation = React.useRef(0);
	const request = React.useRef(null);
	const cancel = React.useCallback(() => {
		generation.current += 1;
		request.current?.abort();
		request.current = null;
		setCreating(false);
		setError("");
	}, []);
	React.useEffect(() => () => {
		generation.current += 1;
		request.current?.abort();
	}, []);
	const create = async (query) => {
		if (!onCreate) return;
		request.current?.abort();
		const controller = new AbortController();
		request.current = controller;
		generation.current += 1;
		const turn = generation.current;
		setCreating(true);
		setError("");
		try {
			await onCreate(query, { signal: controller.signal });
			if (turn === generation.current && !controller.signal.aborted) onSuccess();
		} catch (cause) {
			const aborted = cause instanceof DOMException && cause.name === "AbortError";
			if (turn === generation.current && !controller.signal.aborted && !aborted) setError("Could not create this option. Try again.");
		} finally {
			if (turn === generation.current) {
				request.current = null;
				setCreating(false);
			}
		}
	};
	return {
		creating,
		error,
		create,
		cancel
	};
}
export { useOptionCreation };

//# sourceMappingURL=use-option-creation.js.map