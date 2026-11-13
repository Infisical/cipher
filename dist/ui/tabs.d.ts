import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
export interface TabDefinition {
    value: string;
    label: React.ReactNode;
    count?: number;
    content?: React.ReactNode;
    disabled?: boolean;
}
type TabsWidth = "content" | "full";
export type TabsProps = Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, "onChange"> & {
    tabs?: TabDefinition[];
    label?: string;
    variant?: "underline" | "segmented";
    width?: TabsWidth;
    onChange?: (value: string) => void;
};
declare function Tabs({ className, orientation, tabs, label, variant, width, onChange, onValueChange, value, defaultValue, children, ref, ...props }: TabsProps & {
    ref?: React.Ref<React.ComponentRef<typeof TabsPrimitive.Root>>;
}): React.JSX.Element;
declare namespace Tabs {
    var displayName: string;
}
declare const tabsListVariants: (props?: ({
    variant?: "segmented" | "underline" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function TabsList({ className, variant, children, onScroll, onWheel, onWheelCapture, ref, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants> & {
    ref?: React.Ref<React.ComponentRef<typeof TabsPrimitive.List>>;
}): React.JSX.Element;
declare namespace TabsList {
    var displayName: string;
}
declare function TabsTrigger({ className, ref, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>): React.JSX.Element;
declare namespace TabsTrigger {
    var displayName: string;
}
declare function TabsContent({ className, ref, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>): React.JSX.Element;
declare namespace TabsContent {
    var displayName: string;
}
export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger };
