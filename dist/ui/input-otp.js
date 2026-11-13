import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { OTPInput, OTPInputContext } from "input-otp";
// src/ui/input-otp.tsx
function InputOTP({ className, containerClassName, value, defaultValue, onChange, ref, ...props }) {
	const [current, setCurrent] = useControllableState({
		value,
		defaultValue: typeof defaultValue === "string" ? defaultValue : "",
		onChange
	});
	return /* @__PURE__ */ jsx(OTPInput, {
		ref,
		"data-slot": "input-otp",
		containerClassName: cn(controls_module_default.otp, (props["aria-invalid"] === true || props["aria-invalid"] === "true") && controls_module_default.otpInvalid, props.disabled && controls_module_default.otpDisabled, containerClassName),
		spellCheck: false,
		value: current,
		onChange: setCurrent,
		className: cn("disabled:cursor-not-allowed", className),
		...props
	});
}
InputOTP.displayName = "InputOTP";
function InputOTPGroup({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "input-otp-group",
		className: cn(controls_module_default.otpGroup, className),
		...props
	});
}
InputOTPGroup.displayName = "InputOTPGroup";
function InputOTPSlot({ index, className, ref, ...props }) {
	const { char, hasFakeCaret, isActive } = React.useContext(OTPInputContext)?.slots[index] ?? {};
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-slot": "input-otp-slot",
		"data-active": isActive,
		className: cn(controls_module_default.otpSlot, controls_module_default.technical, className),
		...props,
		children: [char, hasFakeCaret && /* @__PURE__ */ jsx("div", {
			className: controls_module_default.otpCaretBox,
			children: /* @__PURE__ */ jsx("div", { className: controls_module_default.otpCaret })
		})]
	});
}
InputOTPSlot.displayName = "InputOTPSlot";
function InputOTPSeparator({ ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"aria-hidden": "true",
		"data-slot": "input-otp-separator",
		className: controls_module_default.otpSeparator,
		role: "separator",
		...props,
		children: /* @__PURE__ */ jsx(Icon, {
			name: "minus",
			size: 16
		})
	});
}
InputOTPSeparator.displayName = "InputOTPSeparator";
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };

//# sourceMappingURL=input-otp.js.map