export declare const useControllableState: <Value>({ value, defaultValue, onChange }: {
    value: Value | undefined;
    defaultValue: Value;
    onChange?: (value: Value) => void;
}) => readonly [Value, (next: Value) => void];
