export type OptionCreateHandler = (query: string, context: {
    signal: AbortSignal;
}) => void | Promise<void>;
export declare function useOptionCreation(onCreate: OptionCreateHandler | undefined, onSuccess: () => void): {
    creating: boolean;
    error: string;
    create: (query: string) => Promise<void>;
    cancel: () => void;
};
