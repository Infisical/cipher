import * as React from "react";
import { OTPInput } from "input-otp";
declare function InputOTP({ className, containerClassName, value, defaultValue, onChange, ref, ...props }: React.ComponentPropsWithoutRef<typeof OTPInput> & {
    containerClassName?: string;
} & {
    ref?: React.Ref<React.ComponentRef<typeof OTPInput>>;
}): React.JSX.Element;
declare namespace InputOTP {
    var displayName: string;
}
declare function InputOTPGroup({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace InputOTPGroup {
    var displayName: string;
}
declare function InputOTPSlot({ index, className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    index: number;
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace InputOTPSlot {
    var displayName: string;
}
declare function InputOTPSeparator({ ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace InputOTPSeparator {
    var displayName: string;
}
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
