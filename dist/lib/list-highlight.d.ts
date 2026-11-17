import * as React from "react";
export declare const LIST_HIGHLIGHT_ITEM = "[role=\"menuitem\"], [role=\"menuitemcheckbox\"], [role=\"menuitemradio\"], [role=\"option\"], [cmdk-item], [data-sidebar-target]";
/**
 * Two translucent thumbs per list. The hover thumb follows the pointer and the keyboard's active
 * row and stays on the last row while the pointer is anywhere in the list. A row whose popover,
 * flyout or submenu is open (aria-haspopup with aria-expanded="true" or data-state="open"; a
 * wrapping Tooltip overwrites data-state, so aria-expanded is the reliable signal) pins the hover
 * thumb until it closes, even after the pointer leaves for the popover. The selection thumb
 * rests on the current row and shows only while the hover thumb is hidden. Arrow keys in a field
 * outside the list that names it with aria-controls move the hover thumb too. Render it as the list's
 * last child; it measures its parent.
 */
export declare function ListHighlight(): React.JSX.Element;
