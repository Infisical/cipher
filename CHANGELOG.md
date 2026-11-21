# Changelog

All notable changes to `@infisical/cipher` are listed here. Versions follow semver; while Cipher is on 0.x, a minor bump can include breaking changes.

## 0.1.24 (2026-11-21)

### Added

- `--cipher-size-icon-label` (16px), `--cipher-size-icon-small` (14px) and `--cipher-size-icon-caption` (12px) size an icon beside text: the text's line height minus 4px, for 14px, 13px and 12px text. A leading icon centers on the first line of its text and stays there when the text wraps. ([#215](https://github.com/Infisical/cipher/pull/215))
- `Stack` takes `gap="toolbar"`, the 24px `--cipher-space-toolbar-gap` between a list toolbar and the list, table or results it filters. ([#216](https://github.com/Infisical/cipher/pull/216))

### Changed

- **Visible change:** text buttons at the default size and in frame bands show 16px icons instead of 14px, matching the icons in Select, Tabs and menus beside them. Icon-only buttons keep their sizes. ([#215](https://github.com/Infisical/cipher/pull/215))
- A default `Badge` shows a 12px glyph beside its 12px label, and a control-size `Badge` a 16px glyph. `Banner` and an `Alert` without a title show 14px icons beside their 13px text. `InputGroup` text addons use 16px icons, or 12px at the xs size. `Sidebar` icons stay 18px. ([#215](https://github.com/Infisical/cipher/pull/215))

### Fixed

- An `Item` with a bare icon as media, a `Tile` in row or inline layout with a bare icon and no description, and the icon on an `Item`'s error line now center on the first line of their text instead of sitting about 2px high. Described and stacked tiles are unchanged. ([#215](https://github.com/Infisical/cipher/pull/215))

## 0.1.23 (2026-11-21)

### Added

- `Combobox` with `multiple` takes `loading`, as single mode does: a spinner in the search field and "Searching…" while there are no options yet. Selected chips stay visible and removable while it loads. ([#210](https://github.com/Infisical/cipher/pull/210))
- `--cipher-space-toolbar-gap` (24px) is the gap between a list toolbar, such as a `FilterBar` or a search row, and the list, table or results under it on an open page. Set it as the gap of the stack that holds both. A `Card` toolbar band keeps its own inset. ([#213](https://github.com/Infisical/cipher/pull/213))

### Changed

- Sidebar groups open and close with a height animation instead of snapping, and arrow keys skip a closing group's rows. `CollapsibleContent` animates its height on the same timing as `Accordion`. Both snap when the person prefers reduced motion. ([#211](https://github.com/Infisical/cipher/pull/211))

### Removed

- **Breaking:** `Halftone`'s `reveal` prop. `reveal="hover"` no longer type-checks, so drop it. The corner wash shows at rest and grows on hover or focus, which was the `reveal="always"` default. ([#209](https://github.com/Infisical/cipher/pull/209))

### Fixed

- A long underline `Tabs` row inside a flex or grid item scrolls instead of widening its container, so the edge fade shows and the active tab stays in view. ([#207](https://github.com/Infisical/cipher/pull/207))
- `Toggle` keeps its width in a no-wrap row instead of shrinking below its label. ([#212](https://github.com/Infisical/cipher/pull/212))
- The list highlight no longer lands on rows inside a closing collapse, and it follows rows as a collapse in the list resizes. ([#211](https://github.com/Infisical/cipher/pull/211))

### Project

- Native table cells drop an `overflow-clip-margin` that browsers ignored. There is no visual change. ([#208](https://github.com/Infisical/cipher/pull/208))

## 0.1.22 (2026-11-21)

### Added

- `DetailLayout` takes `asideWidth="narrow"`, a 320px sidecar for a narrower aside. The default width is unchanged. ([#202](https://github.com/Infisical/cipher/pull/202))
- `PageHeader` takes `moreActions` and `moreLabel`. Secondary actions show as outline buttons before `actions` on a wide header and move into a "More actions" menu below 40rem. ([#203](https://github.com/Infisical/cipher/pull/203))
- `Heading` takes `count`, shown after the title the way `List`'s `countPlacement="title"` shows it. On a wrapping heading the count follows the last word. `TitleCount` from `ui/badge` is the shared piece. ([#205](https://github.com/Infisical/cipher/pull/205))

### Fixed

- `Combobox`'s inline Create row wraps a long label instead of truncating it. ([#204](https://github.com/Infisical/cipher/pull/204))

## 0.1.21 (2026-11-20)

### Added

- `Button` takes `variant="success"` for the one action that completes a positive outcome behind a gate, such as Merge on an approved change request. It is a solid green with a white label in both themes, backed by the new `ok-fill`, `on-ok` and `ok-hover` tokens. ([#198](https://github.com/Infisical/cipher/pull/198))
- A framed `Card` takes `toolbar`, a row of controls flush under the head with a rule below it. Its controls take the band height, and a `DataTable` after it still goes flush. ([#192](https://github.com/Infisical/cipher/pull/192))
- `StatCard` takes `chart`, `chartPlacement` (`inset` or `bleed`), `chartSize`, `footer` and `action`. `StatCardChart` from `ui/stat-card-chart` draws an area chart sized to that band. ([#194](https://github.com/Infisical/cipher/pull/194))
- `Halftone` takes `width` and `height`, pixel caps on the corner wash, so a fixed corner box no longer needs a positioned wrapper. ([#195](https://github.com/Infisical/cipher/pull/195))
- `SidebarLink` takes `badge`, shown after the label in the expanded row and in a rail item's child menu. ([#196](https://github.com/Infisical/cipher/pull/196))
- `Item` takes `actionsBreakpoint`, the content width in pixels at which its actions move beside the copy. ([#197](https://github.com/Infisical/cipher/pull/197))
- `Select`, `Combobox` and `DateRangePicker` triggers show the selected option's badge after the value. The value truncates before the badge, and shows its full text on hover. ([#193](https://github.com/Infisical/cipher/pull/193))
- `DataTable` takes `showFewer`, a "Show fewer" beside "Show more". ([#199](https://github.com/Infisical/cipher/pull/199))

### Changed

- `DataTable`'s `loadMore` is a ghost "Show more" in a footer band, with `persistentStatus` muted at its start, instead of an outline button under the rows. `loadMore.label` is optional. In a framed `Card` with `footerPlacement="frame"` and no footer of its own, the footer moves into the card's frame band. With `height`, the band stays at the bottom of the scroll window. ([#199](https://github.com/Infisical/cipher/pull/199))

### Fixed

- A bare `List`'s footer lines up with its rows' text instead of the list's edge. ([#200](https://github.com/Infisical/cipher/pull/200))
- `FilterBar` wraps on a narrow bar instead of crushing the search and spilling its actions, and a long applied chip ends in an ellipsis. ([#191](https://github.com/Infisical/cipher/pull/191))

## 0.1.20 (2026-11-20)

### Added

- `BadgeGroup` keeps a row of badges on one line. Badges that don't fit collapse into a `+N` button that opens a popover listing them, and a single badge that is still too wide truncates. ([#186](https://github.com/Infisical/cipher/pull/186))
- `ActivityLog` events take `description`, a muted second line under the actor and summary that wraps instead of truncating. ([#189](https://github.com/Infisical/cipher/pull/189))

### Changed

- A framed `Card` with `footerPlacement="frame"` puts its title in the band like other framed cards, and leaves out the inset when it has no body. A card with a backdrop keeps its title over the backdrop. ([#187](https://github.com/Infisical/cipher/pull/187))

### Fixed

- Several badges in a table cell stay on one line again. Since 0.1.19 they could wrap, which narrowed a column sized to its content and made the row taller. Badges now wrap only in a `DataList` value and `Item` meta. ([#186](https://github.com/Infisical/cipher/pull/186))

### Project

- The showcase opens a page from a short link such as `#/table` and switches the address to the full route. ([#188](https://github.com/Infisical/cipher/pull/188))
- The overlay overflow check also opens combobox inputs, so it covers `SecretPathInput` suggestions. ([#185](https://github.com/Infisical/cipher/pull/185))

## 0.1.19 (2026-11-20)

### Added

- `Tabs` take a per-tab `countTone` (`"neutral"`, `"warn"` or `"bad"`), and `Count` gains `warn` and `bad` tones. `List` and `ListHeader` take `countPlacement="title"` to show the count beside the title. ([#153](https://github.com/Infisical/cipher/pull/153))
- `DataTable` takes `isRowActivatable`. A row that returns `false` keeps the default cursor, gets no tab stop and ignores click and Enter. ([#162](https://github.com/Infisical/cipher/pull/162))
- `CopyValue` shows a value with an icon-only copy button on its first line. `DataList` items take `{ action }`, a trailing action on the value's first line. ([#175](https://github.com/Infisical/cipher/pull/175))
- `Button` takes `applied`, a square dot on a search or filter trigger that keeps the icon at full ink. `HeaderSearch` uses the same dot. ([#176](https://github.com/Infisical/cipher/pull/176), [#180](https://github.com/Infisical/cipher/pull/180))

### Changed

- A framed `Card` whose body holds only a `DataTable` or table container goes flush on its own, in every state, without `flush`. An empty flush table card is about 24px taller than the old inset empty state. ([#165](https://github.com/Infisical/cipher/pull/165))
- On a narrow `PageHeader`, a long title clamps to two lines with an ellipsis and expands on tap. ([#167](https://github.com/Infisical/cipher/pull/167))
- On a narrow `PageHeader`, a single `collapse` badge stays beside the title and truncates before the title line wraps. ([#177](https://github.com/Infisical/cipher/pull/177))
- `Badge` is never wider than its container. Long text ends in an ellipsis with the full value on hover, and several badges in a `DataList` value, a wrapping table cell or `Item` meta wrap with a 4px gap. ([#179](https://github.com/Infisical/cipher/pull/179))
- `CipherScope` renders on the server, and every client entry is marked `"use client"`. ([#164](https://github.com/Infisical/cipher/pull/164))

### Fixed

- `writeClipboard` falls back to a selection copy outside secure contexts, and `SecretValue` and `SensitiveEditor` use it. ([#159](https://github.com/Infisical/cipher/pull/159))
- `AccordionTrigger` truncates a long title so trailing badges stay visible. ([#161](https://github.com/Infisical/cipher/pull/161))
- A focus ring around a bare icon button inside a wrapped card band action, such as a `HeaderSearch` trigger, is no longer clipped. ([#178](https://github.com/Infisical/cipher/pull/178))
- `Dialog` and `AlertDialog` content no longer shows scrollbars with classic, always-visible scrollbars when its content fits. ([#181](https://github.com/Infisical/cipher/pull/181))

### Project

- A README for users, `RELEASING.md`, a contributing guide, code of conduct, security policy, issue and PR templates, and this changelog. ([#166](https://github.com/Infisical/cipher/pull/166), [#169](https://github.com/Infisical/cipher/pull/169), [#171](https://github.com/Infisical/cipher/pull/171))
- Workflow actions are pinned to commit SHAs, the Release workflow can publish to npm, and showcase examples use obviously fake values. ([#163](https://github.com/Infisical/cipher/pull/163), [#168](https://github.com/Infisical/cipher/pull/168), [#170](https://github.com/Infisical/cipher/pull/170))
- Visual checks run in CI, including a check that open overlays fit their scroll box with classic scrollbars. ([#174](https://github.com/Infisical/cipher/pull/174), [#183](https://github.com/Infisical/cipher/pull/183))

## 0.1.18 (2026-11-20)

### Added

- `TopBar` takes `pairRoot` (default `true`). With the sidebar open, the first crumb now fills the sidebar width so its divider lands on the sidebar edge; pass `pairRoot={false}` to size it to its content. ([#147](https://github.com/Infisical/cipher/pull/147))
- `Input` and `Textarea` take `placeholderShort`, shown when the full `placeholder` doesn't fit the field width. ([#146](https://github.com/Infisical/cipher/pull/146))
- `Sidebar` takes `footerIndicator` (`"accent"`, `"warn"` or `"bad"`), a square dot on the collapsed rail's footer button. Put its meaning in `footerLabel`. ([#152](https://github.com/Infisical/cipher/pull/152))
- `ButtonGroupText` takes `size="xs"` and truncates long text with an ellipsis instead of widening the group. ([#151](https://github.com/Infisical/cipher/pull/151))
- `ActivityLog` takes `counts` (default `true`); `counts={false}` hides the per-day event counts and the "Showing N events" footer. ([#144](https://github.com/Infisical/cipher/pull/144))
- New `list` icon. ([#156](https://github.com/Infisical/cipher/pull/156))

### Changed

- `ActivityLog` sits flush inside a framed `Card` and no longer draws row dividers within a day, so the day headings group the rows. ([#144](https://github.com/Infisical/cipher/pull/144))
- Attached `ButtonGroup` items now share a single 1px line at each seam instead of drawing two borders. ([#157](https://github.com/Infisical/cipher/pull/157))
- `TableActionsCell`, `DataTable` actions and other pinned table tails draw their left divider only while content scrolls under them. ([#155](https://github.com/Infisical/cipher/pull/155))
- `Field` without a `label` now renders its `error` or `description` below the control and sets `aria-invalid` and `aria-describedby` on it. Give the control its own accessible name. ([#150](https://github.com/Infisical/cipher/pull/150))
- `FileTree` folders with nothing to expand show no caret, drop `aria-expanded`, and no longer toggle on click or arrow keys. Under `foldersOnly`, a folder holding only files counts as childless. ([#149](https://github.com/Infisical/cipher/pull/149))
- `Breadcrumb` warns in development builds when a crumb has `onNavigate` but no `link` or `href`, since it renders as a button that can't open in a new tab. ([#148](https://github.com/Infisical/cipher/pull/148))

## 0.1.17 (2026-11-19)

### Added

- `NameLine` lays out media, name, badges and trailing content on one line. Badges shrink first, then the name truncates to a 12ch floor, and the trailing content stays whole. ([#140](https://github.com/Infisical/cipher/pull/140))
- `Badge` takes `collapse`: an icon or dot badge drops to its glyph under pressure, and a text badge truncates to about 6ch with its full text as a title. ([#140](https://github.com/Infisical/cipher/pull/140))
- `PageHeader` takes `truncateTitle` to keep a long title on one line with an ellipsis and the full title on hover. ([#141](https://github.com/Infisical/cipher/pull/141))
- `badge-soft` token, the fill for the neutral soft `Badge`. ([#142](https://github.com/Infisical/cipher/pull/142))

### Changed

- `PageHeader` leads its trail with a back chevron inside the first crumb's link, and dims crumbs until hover. A crumb that passes its own `media` keeps it. ([#138](https://github.com/Infisical/cipher/pull/138))
- `PageHeader` narrows by rule: under 40rem, actions move below the title and description and icon-plus-text buttons drop to their icon. Long titles wrap instead of breaking mid-word. ([#141](https://github.com/Infisical/cipher/pull/141))
- `MultiSelect` and `Combobox` show the create action as an option row with a leading plus, highlighted by default when nothing matches so Enter creates. With partial matches the row sits after them and the first match stays active. The `MultiSelect` footer create button is gone. ([#139](https://github.com/Infisical/cipher/pull/139))
- Every `Badge` tone except `outline` is borderless. In Dark, neutral soft fills with `line-soft`. ([#142](https://github.com/Infisical/cipher/pull/142))

### Fixed

- A `DataTable` empty state stays centered in the visible frame when the table is wider than its frame and scrolls sideways. ([#143](https://github.com/Infisical/cipher/pull/143))

## 0.1.16 (2026-11-18)

### Added

- 31 new icons, including product marks (`keyhole`, `scan-key`, `terminal-key`, `agent-lock`), project folders (`folder-secrets`, `folder-cert`, `folder-kms`, `folder-scanning`, `folder-pam`, `folder-agent`) and navigation icons such as `shield-user`, `network`, `webhook`, `layers`, `tag` and `book`. ([#135](https://github.com/Infisical/cipher/pull/135))

### Changed

- The `key`, `cert` and `machine` icons are redrawn: `cert` is now a certificate, `machine` is a chip, and the old `cert` shield-with-check shape moves to the new `shield-check`. ([#135](https://github.com/Infisical/cipher/pull/135))
- Table cells clip their own content with an ellipsis instead of painting into the neighbouring cell. Pinned and actions cells stay unclipped. Names in narrow `DataTable`s can show a few fewer characters than before. ([#132](https://github.com/Infisical/cipher/pull/132))

### Fixed

- `TableHeadButton` truncates its label and keeps the sort or menu chevron visible. ([#132](https://github.com/Infisical/cipher/pull/132))

## 0.1.15 (2026-11-18)

### Added

- `DataTable` columns take `edit: (row) => InlineEdit | undefined` for inline editable cells, with async `value` loading, sync or async `validate`, `transform` and `onCommit`. `EditableCell` and the `InlineEdit` type are exported from `table`. ([#127](https://github.com/Infisical/cipher/pull/127))
- `TilePicker` takes `density="compact"`, `groupBy="category"`, `layout="list"`, `popular="featured"`, `pinnedLabel`, `searchable={false}` and `value`. Items gain `category` and `badge`. ([#126](https://github.com/Infisical/cipher/pull/126))
- `ListRow` takes `external` to open its link in a new tab. New token `--cipher-size-tile-inline-min` (240px). ([#126](https://github.com/Infisical/cipher/pull/126))
- `EmptyScope` carries ghost, size and fill defaults for `Empty`, and `EmptySurface` resets them for overlays. ([#131](https://github.com/Infisical/cipher/pull/131))

### Changed

- `TilePicker` defaults to comfortable tiles with the media on the left, a two-line title and one muted line (description, or category). The stacked tile is retired. ([#126](https://github.com/Infisical/cipher/pull/126))
- Leading media in `Tile` and `Banner` aligns to the top of the container instead of centering against wrapping copy. ([#126](https://github.com/Infisical/cipher/pull/126))
- `Empty` takes its size from its container (`sm` in a `DataTable`, `DataGrid`, `FileTree`, `List` or card body, default elsewhere). An explicit `size` still overrides it. ([#131](https://github.com/Infisical/cipher/pull/131))
- An `Empty` in a flush `Card` or `SettingsCard` body gets the height of a ghosted table empty, without ghost rows. ([#131](https://github.com/Infisical/cipher/pull/131))
- `SortableGrid` pointer drag follows the pointer and reorders only when the drop target changes, with a dashed placeholder in the target slot. The placeholder border uses `--cipher-muted`. ([#122](https://github.com/Infisical/cipher/pull/122)) ([#128](https://github.com/Infisical/cipher/pull/128))
- In Dark, `DataTable` group rows use the header tint. Soft `Badge` uses a paper fill with a `line-soft` border. The mobile theme picker shows an icon and label on each segment. ([#124](https://github.com/Infisical/cipher/pull/124))
- Anything rendered as `a[href]` now shows the pointer cursor, including Sidebar link rows, `Button` with `asChild`, menu items, TopBar mobile sheet rows, `CommandMenu` items and route `TabsTrigger`s. Controls that act in place keep the default cursor. ([#130](https://github.com/Infisical/cipher/pull/130))

### Fixed

- `DropdownMenu`, `ContextMenu`, `Popover`, `Dialog` and `AlertDialog` keep their background, ring and shadow when their content overflows. Scrolling and the edge fade moved onto an inner scroller. ([#129](https://github.com/Infisical/cipher/pull/129))
- `ListRow` text stays inside its frame when a description holds content that doesn't wrap. ([#124](https://github.com/Infisical/cipher/pull/124))

### Deprecated

- `TilePickerItem.eyebrow` is renamed `category`. `eyebrow` remains as an alias for one release. ([#126](https://github.com/Infisical/cipher/pull/126))

## 0.1.14 (2026-11-17)

### Added

- A `StatCard` with a link covers the whole card with the link's hit area, and its own controls stay clickable above it. ([#118](https://github.com/Infisical/cipher/pull/118))

### Changed

- A two-pane `Sheet` collapses its aside into a Details tab below 880px (was 720px). Between 720px and 880px you now get the tab where you used to get both panes. ([#120](https://github.com/Infisical/cipher/pull/120))

### Fixed

- A framed `StatCard` and a framed `Card` place their backdrop in the content panel, not under the card head. The `Card` backdrop skips content set with `dangerouslySetInnerHTML`, and row links stay clickable. ([#119](https://github.com/Infisical/cipher/pull/119)) ([#121](https://github.com/Infisical/cipher/pull/121))
- Two-pane `Sheet`: the identity block no longer stretches, aside `DataList` rows fill the pane width, and opening the sheet focuses the first control in the main pane. ([#120](https://github.com/Infisical/cipher/pull/120))

## 0.1.13 (2026-11-17)

### Added

- `ListQueryScope` wraps a list and its `FilterBar`, so `DataTable`, `Grid` and `TilePicker` turn off the empty-state ghost while a search or filter is active. ([#104](https://github.com/Infisical/cipher/pull/104))
- Two-pane `Sheet` with `SheetAside` and `Panes`. Below the collapse width the aside becomes a Details tab. `Sheet` gains size `xl`. ([#95](https://github.com/Infisical/cipher/pull/95))
- `MultiSelect` options take leading icons, and a Create row hands the typed value to the caller. ([#99](https://github.com/Infisical/cipher/pull/99))
- `Input` takes `disabledReason` to explain why a field is disabled. ([#103](https://github.com/Infisical/cipher/pull/103))
- `FilterBar` gets a text verb for exact match. `Combobox` gains `keywords`, group search and `searchPlaceholder`. ([#109](https://github.com/Infisical/cipher/pull/109))
- `Tile` and `TilePickerItem` accept `href` or `asChild` and render a link. Selected links use `aria-current`. ([#110](https://github.com/Infisical/cipher/pull/110))
- `TilePicker` items can be `pinned` to stay at the top. ([#111](https://github.com/Infisical/cipher/pull/111))

### Changed

- `Grid` counts children with `Children.toArray`, so `null` and `false` children leave it empty and show its `empty` slot. ([#104](https://github.com/Infisical/cipher/pull/104))
- `TilePicker` shows the no-match state, not its first-run `empty`, when a search runs over a picker with no items. ([#104](https://github.com/Infisical/cipher/pull/104))
- A horizontal `Field` among vertical fields caps at the field measure, and `data-width="wide"` now applies to horizontal fields. Standalone horizontal fields are unchanged. ([#95](https://github.com/Infisical/cipher/pull/95))

### Fixed

- Framed `Card` header actions no longer force every non-button child to a block, so `Select` chevrons, `Badge` text and `Search` placeholders render again. ([#113](https://github.com/Infisical/cipher/pull/113))
- `Item` text buttons sit on their own row again at narrow widths instead of squeezing the title. ([#114](https://github.com/Infisical/cipher/pull/114))

## 0.1.12 (2026-11-17)

### Fixed

- `Button` label parts keep their spacing again (for example "Org ID is org_9f2c41" in `FilterBar` chips). The label span from 0.1.11 is now `display: contents`, and only becomes a truncating block inside a framed `Card` header action. ([#108](https://github.com/Infisical/cipher/pull/108))

## 0.1.11 (2026-11-17)

### Fixed

- An action `Button` with an icon in a framed `Card` header no longer stacks the icon above its label or grows past the 28px band. ([#106](https://github.com/Infisical/cipher/pull/106))

### Changed

- A `Button` that isn't icon-only renders its label inside `<span data-slot="button-text">`. Text and accessible names are unchanged; CSS or tests that expect a bare text node directly inside `[data-press]` are affected. ([#106](https://github.com/Infisical/cipher/pull/106))

## 0.1.10 (2026-11-17)

### Added

- `badges` on `SheetTitle`, `DialogTitle`, `MultiStep` and `SheetView`, for status badges and a `DocumentationLink` sized to the title. ([#89](https://github.com/Infisical/cipher/pull/89))
- `SheetHeader` and `SheetView` take `tabs`, drawn on the header's bottom rule. ([#90](https://github.com/Infisical/cipher/pull/90))
- `Breadcrumb` takes `menu` for actions on the current crumb and `trailingDivider` for a divider after a lone root crumb. ([#93](https://github.com/Infisical/cipher/pull/93))
- `MultiStep` takes `cancelLabel` for the first-step Cancel button and `footerStart` for a secondary action at the start of the footer. ([#94](https://github.com/Infisical/cipher/pull/94)) ([#97](https://github.com/Infisical/cipher/pull/97))
- `Tile` takes `layout="stacked"`, `eyebrow` and `disabledReason`. New token `--cipher-size-tile-stacked-min` (280px). ([#98](https://github.com/Infisical/cipher/pull/98))
- `TilePicker`: search plus a responsive grid of stacked tiles, popular items first, and a Clear search empty state. It also takes `empty` and `ghost`. ([#98](https://github.com/Infisical/cipher/pull/98))
- `Textarea` takes `maxRows`: the field grows with its content up to that many lines, then scrolls. ([#100](https://github.com/Infisical/cipher/pull/100))
- `Empty` takes `ghost` (`"rows"` or `"cards"`) to fade placeholders behind the message. `DataTable` draws rows, and `Grid` (new `empty` slot) and `TilePicker` draw cards. `EmptyGhostScope` sets the default for custom containers. New token `--cipher-size-ghost-card` (132px). ([#101](https://github.com/Infisical/cipher/pull/101))
- `--cipher-space-field-legend` token for the legend-to-content gap. ([#102](https://github.com/Infisical/cipher/pull/102))

### Changed

- A `DataTable` `empty` slot containing an `Empty` now draws ghost rows. Pass `ghost={false}` to keep the old look, and `filtered` when rows are narrowed by a search or filter. A plain string `empty` is unchanged. ([#101](https://github.com/Infisical/cipher/pull/101))
- `FieldSet` spacing: the legend sits 20px above its first field (was 6px), consecutive `FieldSet`s sit 32px apart (was 16px), and a description sits 20px above the first field (was 16px). ([#102](https://github.com/Infisical/cipher/pull/102))
- Default `Breadcrumb` measures its crumbs and moves the ones that don't fit behind an ellipsis dropdown, replacing the count-based expand. `maxItems` still caps visible crumbs. ([#93](https://github.com/Infisical/cipher/pull/93))
- Menu and list rows with a description put the leading icon or image on the title's first line, and descriptions wrap to two lines before truncating, with the full text on hover. ([#96](https://github.com/Infisical/cipher/pull/96))
- A disabled `DropdownMenuItem`, `ContextMenu`, checkbox or radio row dims its leading `img` or `[data-menu-icon]` along with its text. ([#94](https://github.com/Infisical/cipher/pull/94))
- Expanding a table row with a disclosure toggle no longer adds the hover layer over its selected ground. ([#91](https://github.com/Infisical/cipher/pull/91))
- At default density, long `DataList` values truncate inside the list. In a framed `Card` header with an action, the title truncates only once the action is down to 96px, after which the action truncates and its full text goes in `title`. ([#92](https://github.com/Infisical/cipher/pull/92))

## 0.1.9 (2026-11-15)

### Added

- `SheetViews`, `SheetView` and `useSheetView`: a stack of views inside one `Sheet`. A child view takes over the header, body and footer, can widen the sheet with `size`, and asks before discarding when `dirty`. ([#83](https://github.com/Infisical/cipher/pull/83))
- `MultiStep` takes `variant="view"` to run inside a `SheetView`. ([#83](https://github.com/Infisical/cipher/pull/83))
- `DiscardChangesAlertDialog` takes `onCloseAutoFocus`. ([#83](https://github.com/Infisical/cipher/pull/83))
- `ShareBar`: a stacked share bar with a legend. Past `max`, the smallest shares fold into an expandable "Other (n)" row. ([#84](https://github.com/Infisical/cipher/pull/84))
- `CodeEditor`: a SQL editor with highlighting for Postgres, CockroachDB, MySQL, Snowflake and ClickHouse, and Mod+Enter to run the selection or the query. CodeMirror 6 is an optional peer: install `@codemirror/view`, `state`, `commands`, `language`, `lang-sql` and `@lezer/highlight` to use it. ([#85](https://github.com/Infisical/cipher/pull/85))
- `MultiStepResult` takes `step` to send every field error and the message to one step. ([#86](https://github.com/Infisical/cipher/pull/86))
- New `send` icon. ([#87](https://github.com/Infisical/cipher/pull/87))
- Registry items now list dynamic `import()` packages as dependencies, so `r/code-editor.json` lists the CodeMirror packages. ([#85](https://github.com/Infisical/cipher/pull/85))

### Changed

- `MultiStep` `onComplete` field errors go to the earliest step whose content holds a `Field` with that `name`, and focus it. Fields no step holds still land on the last step. ([#86](https://github.com/Infisical/cipher/pull/86))
- Inside `SheetViews`, `SheetClose` and the close button run the discard guard for every dirty child view before the sheet's `onOpenChange`. ([#83](https://github.com/Infisical/cipher/pull/83))
- An overlay's first focus never lands in an `inert` subtree. ([#83](https://github.com/Infisical/cipher/pull/83))

## 0.1.8 (2026-11-15)

### Breaking changes

- `MultiStep` `onComplete` now returns `MultiStepResult | Promise<MultiStepResult>` instead of `void | Promise<unknown>`. An `onComplete` that returns a value, such as `() => mutation.mutateAsync(dto)`, fails to type-check. Await it without returning the value: `async () => { await mutation.mutateAsync(dto); }`, so `MultiStep` still waits for the save and shows its error if it fails. ([#78](https://github.com/Infisical/cipher/pull/78))

### Added

- `WorldMap`: a dependency-free world map that tones countries and sizes square markers by count, with tooltips, keyboard navigation, a legend and new `map-*` tokens. ([#66](https://github.com/Infisical/cipher/pull/66))
- `RemoteDesktop`: a viewer frame with fit-to-frame scaling, input capture, connection states and a toolbar. You supply the RDP client through `canvasRef` or `surface`. ([#67](https://github.com/Infisical/cipher/pull/67))
- `EventCalendar`: a month grid of dated events with tone dots, a "+N more" list, month navigation and keyboard support. ([#68](https://github.com/Infisical/cipher/pull/68))
- `SessionReplay`: a player for session recordings with a marked timeline, 0.5x to 4x speed and an event list that follows playback. ([#69](https://github.com/Infisical/cipher/pull/69))
- `Terminal`: an xterm.js shell surface with connection header, status and retry. It needs `@xterm/xterm` and `@xterm/addon-fit`, and adds 16 `ansi-*` tokens. ([#70](https://github.com/Infisical/cipher/pull/70))
- `Text`, `SmallText`, `Meta` and `InlineItem` take `truncate`. `InlineItem` takes `shrink={false}`. ([#73](https://github.com/Infisical/cipher/pull/73))
- `FileInput`: a drop zone with Browse button, `accept` and `maxSize` checks, and a selected-file list. ([#74](https://github.com/Infisical/cipher/pull/74))
- `MultiStep` steps take `completeVariant: "destructive"` and `completeIcon`. ([#77](https://github.com/Infisical/cipher/pull/77))
- `MultiStep` `onComplete` can return field errors or a footer message to keep the flow open without a toast. `MultiStepResult` is exported. ([#78](https://github.com/Infisical/cipher/pull/78))
- `Combobox` takes `creation={{ mode: "action", label, onSelect }}`, which shows the Create row and calls `onSelect({ query, complete })`. ([#79](https://github.com/Infisical/cipher/pull/79))
- `FileTree` takes `renderActions`, `renderContextMenu` and inline rename (`renaming`, `onRenamingChange`, `onRename`, F2). ([#80](https://github.com/Infisical/cipher/pull/80))
- `Select`, `SelectContent` and `SelectItem` take `wrap` to wrap long option labels. ([#72](https://github.com/Infisical/cipher/pull/72))

### Changed

- A `MultiStep` with one step hides "Step 1 of 1", the progress bar and the page rail, and the card takes the full width. In a dialog or sheet with a `title`, the repeated step heading is dropped too. ([#81](https://github.com/Infisical/cipher/pull/81))
- The `MultiStep` footer and its buttons wrap on a narrow card instead of overflowing. ([#77](https://github.com/Infisical/cipher/pull/77))
- The `FilterBar` built-in search now answers the `/` shortcut by default. With a second `FilterBar` or another `slashShortcut` input on a page, pass `slashShortcut={false}` on all but one. ([#71](https://github.com/Infisical/cipher/pull/71))
- `Select` shows the full text of truncated option labels and the selected value on hover. ([#72](https://github.com/Infisical/cipher/pull/72))
- `DatePicker` and `DateRangePicker` popovers size to the calendar, edge-day focus rings are no longer clipped, and the footer wraps. ([#76](https://github.com/Infisical/cipher/pull/76))
- The `MultiSelect` and multiple `Combobox` search keeps focus after an option is created. ([#75](https://github.com/Infisical/cipher/pull/75))

## 0.1.7 (2026-11-15)

### Added

- `Input` takes `slashShortcut` so `/` focuses a page search through one shared listener. `kbd="/"` remains decoration only. ([#53](https://github.com/Infisical/cipher/pull/53))
- `Input` takes `suggestedValue`, shown as the placeholder and filled in by Tab. ([#55](https://github.com/Infisical/cipher/pull/55))
- `DialogBody`: a scrolling body slot with a pinned header and footer. ([#57](https://github.com/Infisical/cipher/pull/57))
- `Link`: an inline text link for prose, with `underline="always"` to keep the underline. ([#58](https://github.com/Infisical/cipher/pull/58))
- `ComboboxOption` takes `icon`, shown in the list and in a single-selection trigger. ([#59](https://github.com/Infisical/cipher/pull/59))
- `--cipher-folder` token for folder icons, used by `FileTree` and `SecretPathInput`. ([#60](https://github.com/Infisical/cipher/pull/60))
- `MultiSelect` takes `onSearch` and `loading` for server search. Selections outside the current results stay selected. ([#61](https://github.com/Infisical/cipher/pull/61))
- `SecretPathInput` takes `globSuggestions`, offering `*` and `**` rows for the current folder. ([#62](https://github.com/Infisical/cipher/pull/62))
- `StatusText` `icon` and `loading` are optional, so a bare status inside `TooltipText asChild` can take focus. ([#63](https://github.com/Infisical/cipher/pull/63))
- `Sidebar` takes `footer`, `footerIcon` and `footerLabel` for a bottom-left corner object. The `sidebar` registry item now depends on `button` and `popover`. ([#56](https://github.com/Infisical/cipher/pull/56))
- New `list-checks` icon. ([#56](https://github.com/Infisical/cipher/pull/56))

### Changed

- In a framed `Card` head band and frame footer band, every `Button` renders at 28px (`size-control-band`) with a 14px icon, whatever `size` you pass. Buttons inside a field box or input group keep their size. ([#64](https://github.com/Infisical/cipher/pull/64))
- An empty `DataTable` has 48px above and below its empty state (about 168px under the header, up from 72px). ([#54](https://github.com/Infisical/cipher/pull/54))
- Toasts sit 24px from the bottom on wide screens. An open `FloatingActionBar` lifts them only when it would overlap. ([#51](https://github.com/Infisical/cipher/pull/51))
- A `virtual` `DataTable` without `height` scrolls with the page, its sticky header sticks to the page scroll area, and Load more moves to the foot band. With `height`, the window is trimmed to whole rows. ([#52](https://github.com/Infisical/cipher/pull/52))

## 0.1.6 (2026-11-14)

### Added

- `HuePortal` (`@infisical/cipher/scope`) carries a hue scope into sheets, dialogs and menus. ([#45](https://github.com/Infisical/cipher/pull/45))
- `Inset` (`@infisical/cipher/ui/inset`) for blocks nested in a frame: tint fill, no border. ([#40](https://github.com/Infisical/cipher/pull/40))
- `HeaderSearch` (`@infisical/cipher/ui/header-search`): a popover search for a card's action slot that marks an applied query with a square dot. ([#42](https://github.com/Infisical/cipher/pull/42))
- `SettingsCard` takes `saveStatus`, and the new `useAutosave` hook drives it. ([#49](https://github.com/Infisical/cipher/pull/49))
- `Combobox` takes `clearLabel` for the clear button (default "Clear all selections"). ([#36](https://github.com/Infisical/cipher/pull/36))
- `book-open` glyph for `DocumentationLink`. ([#41](https://github.com/Infisical/cipher/pull/41))
- New primitives (`black`, `white`, `red`, `neutral-*`). No token is renamed or removed. ([#47](https://github.com/Infisical/cipher/pull/47))

### Changed

- The accent, and everything built from it (accent-2, wash, line, accent-fg, chart-3, switch, slider and button material), follows the nearest `hueScope`'s hue. Outside every scope it stays #e3f047. ([#45](https://github.com/Infisical/cipher/pull/45))
- Controls in framed `Card` header and footer bands are 28px with no `size` prop, and band side padding is `space-frame-inline` (9px from the frame edge). Cards with a header and footer but no body gain 16px above the footer. ([#38](https://github.com/Infisical/cipher/pull/38))
- `SettingsCard` has a 32px head row and shows a footer only when needed. ([#49](https://github.com/Infisical/cipher/pull/49))
- The `Combobox` clear X replaces the chevron in one pinned trailing slot, and clearing with the menu open keeps it open. ([#36](https://github.com/Infisical/cipher/pull/36)) ([#43](https://github.com/Infisical/cipher/pull/43))
- The `Sidebar` navigation sheet stays open when a drill-in or back row navigates, and keyboard drill-in keeps focus. ([#44](https://github.com/Infisical/cipher/pull/44))
- `Item` puts actions inline at 36rem of content width instead of 44rem. ([#40](https://github.com/Infisical/cipher/pull/40))
- `TopBar` actions move into the navigation sheet when the bar is narrow. ([#39](https://github.com/Infisical/cipher/pull/39))
- The Calendar today marker, `AvatarBadge` and `SettingsCard` markers are square dots. ([#48](https://github.com/Infisical/cipher/pull/48)) ([#49](https://github.com/Infisical/cipher/pull/49))
- The light sidebar, frame-soft and row-done colors move by at most 0.64 ΔE. ([#47](https://github.com/Infisical/cipher/pull/47))

## 0.1.5 (2026-11-14)

### Added

- `SortableGrid`: items in responsive columns (`minItemWidth`) that users reorder by pointer or keyboard. Each item places its grip from `renderItem`'s `handle`, and `isItemDisabled` locks an item. ([#31](https://github.com/Infisical/cipher/pull/31))
- `DataTable` takes `reorder: { onReorder, isRowDisabled? }` for drag-to-reorder rows on flat `rows`. Leave `sort` unset while it's on. ([#31](https://github.com/Infisical/cipher/pull/31))
- `SortableHandle` and `SortableAnnouncer` are exported from `sortable-list` for custom sortable surfaces. ([#31](https://github.com/Infisical/cipher/pull/31))
- `ErrorState` takes `homeLabel` and `homeLink`. ([#32](https://github.com/Infisical/cipher/pull/32))
- New icons `award`, `scan-line`, `scan-search`, `radar`, `zap`, `vault`, `file-key` and `users`. `layout-grid` and `server` are new names for the `apps` and `machine` shapes. ([#32](https://github.com/Infisical/cipher/pull/32))

### Fixed

- Pressing a `SortableList` grip without dragging no longer leaves the item held. ([#31](https://github.com/Infisical/cipher/pull/31))

## 0.1.4 (2026-11-14)

### Breaking changes

- `MultiStep` `validate` no longer accepts a string. Return `boolean | void | { fields?, message? }` instead; `fields` puts each message on the `<Field name>` with that key, and anything thrown from `validate` or `onComplete` becomes a `toast.error`. ([#5](https://github.com/Infisical/cipher/pull/5))
- `MultiSelect` `description` now renders under the label, and the trailing slot is `meta`. Move short values such as counts to `meta`. ([#14](https://github.com/Infisical/cipher/pull/14))

### Added

- Icon props take `IconSource`, a glyph name or a Lucide component, wherever they took `IconName`. ([#14](https://github.com/Infisical/cipher/pull/14))
- `MultiStep` steps take `render: ({ next }) => ...` to advance on pick, and `disabledReason` to block Continue. `Field` takes `name`, and `FieldErrors` is exported for forms outside `MultiStep`. ([#5](https://github.com/Infisical/cipher/pull/5)) ([#17](https://github.com/Infisical/cipher/pull/17))
- `ErrorState` takes `actionLabel` with `actionLink` or `onAction`. ([#14](https://github.com/Infisical/cipher/pull/14))
- `Combobox` options take `group` and `description`, and `Combobox` and `MultiSelect` take `createLabel`. ([#14](https://github.com/Infisical/cipher/pull/14)) ([#16](https://github.com/Infisical/cipher/pull/16))
- `DataTable`: `column.wrap`, `column.footer` (summary row), `column.secondary` (muted second line), `isRowMuted`, `rowProps` with `data-drop-target`, `CellLink`, and `refreshing` (also on `List`). ([#15](https://github.com/Infisical/cipher/pull/15))
- `DatePicker`: a single-date picker with a presets rail. ([#16](https://github.com/Infisical/cipher/pull/16))
- `FilterBar` search-only mode with `searchValue`, `onSearchChange`, `searchLabel` and `searchPlaceholder`. ([#16](https://github.com/Infisical/cipher/pull/16))
- `Select` takes `icon`. `FieldSet` takes `legend`, `description`, `help` and `actions`, and a group `Field` takes `help`. ([#16](https://github.com/Infisical/cipher/pull/16))
- `ActivityLog` takes `hasMore`, `empty` and a per-entry `badge`. ([#17](https://github.com/Infisical/cipher/pull/17))
- `StatusText` `size`, `ChartContainer` `height` and `aspect`, `Button` `loadingLabel`, `Badge` `icon`, and `Text` and `SmallText` `preWrap`. ([#17](https://github.com/Infisical/cipher/pull/17))
- `Card` takes `badges` on the title line and `selected`. `CardChoice` makes a whole card one radio or checkbox. ([#18](https://github.com/Infisical/cipher/pull/18))
- `StatCard`: a stacked metric card with label, value, icon, tone, delta and trend, note, link, and loading and error states. ([#18](https://github.com/Infisical/cipher/pull/18))
- 23 new icons: `flask`, `package`, `sparkles`, `shield`, `infinity`, `pencil`, `cloud`, `flag`, `undo`, `pause`, `hourglass`, `alarm`, `activity`, `rocket`, `archive`, `archive-restore`, `arrow-right-left`, `receipt`, `credit-card`, `calendar-clock`, `chart-column`, `gift` and `file-text`. ([#14](https://github.com/Infisical/cipher/pull/14)) ([#17](https://github.com/Infisical/cipher/pull/17))

### Changed

- Number inputs lose the browser spin buttons. Arrow keys still step the value. ([#14](https://github.com/Infisical/cipher/pull/14))
- Sheet and dialog steps slide by direction instead of morphing height, and focus goes to the picked option, else the first field. `MultiStep` and `Accordion` content pad by the focus clearance, so edge focus rings are no longer clipped. ([#5](https://github.com/Infisical/cipher/pull/5))
- `Sheet` and `Dialog` open on the first form control, skipping `FieldHelp` and anything marked `data-skip-autofocus`. ([#17](https://github.com/Infisical/cipher/pull/17))
- `ActivityLog` shows the actor first in each row, and `total` is optional. ([#17](https://github.com/Infisical/cipher/pull/17))
- An untitled `Alert` gets its tone icon and actions, and the `PageHeader` description renders a `div`. ([#17](https://github.com/Infisical/cipher/pull/17))
- `List` counts rows through context, so rows inside wrapper components, fragments or sections count toward select-all, eligibility and the empty state. ([#15](https://github.com/Infisical/cipher/pull/15))
- A `DataTable` with pinned actions shrinks the primary column before scrolling sideways when that column has no width and no wrap set. ([#15](https://github.com/Infisical/cipher/pull/15))
- `FilterBar` `onChange` receives only filters that have values. A new filter stays in `FilterBar`'s own state until its picker closes, so URL-backed filters no longer drop a new chip. ([#16](https://github.com/Infisical/cipher/pull/16))
- `DateRangePicker` commits on Apply only with two months or presets; otherwise each pick commits immediately. Pass `commit="immediate"` or `commit="apply"` to choose. ([#16](https://github.com/Infisical/cipher/pull/16))

## 0.1.3 (2026-11-14)

### Added

- `SortableList`: reorderable rows with a grip handle, keyboard pick up, move and drop, and `onReorder` once per committed move. Adds a `grip` glyph. ([#12](https://github.com/Infisical/cipher/pull/12))
- `DateRangePicker` opens `Calendar` in range mode with presets, and `FilterBar` gets a `"date-range"` field type. ([#13](https://github.com/Infisical/cipher/pull/13))
- `Input` (boxed and plain), `Select`, `SelectTrigger` and `Combobox` take `width="xs" | "sm" | "md"` (96, 176 and 256px), backed by `--cipher-size-field-xs`, `-sm` and `-md`. ([#26](https://github.com/Infisical/cipher/pull/26))
- `RadioGroup` takes `columns={2 | 3 | 4}`, and `InlineGrow` is an `Inline` child that takes the leftover width. ([#26](https://github.com/Infisical/cipher/pull/26))
- `TableGroupRow`: a group header row for a hand-built `Table`, with `label`, `meta`, `actions`, `checkbox` and `colSpan`. `DataTableGroup` takes an optional `name` for its checkbox label. ([#28](https://github.com/Infisical/cipher/pull/28))
- `Halftone` takes `bounds="header"`, `size`, `reveal="hover"` and `ambient`, all opt-in. ([#27](https://github.com/Infisical/cipher/pull/27))
- `npm run check` flags a `border-bottom` on `*Row`, `*Pair` or `*Item` selectors that never reset it for the last row. ([#24](https://github.com/Infisical/cipher/pull/24))

### Changed

- `DataList` draws lines only between pairs, so it no longer ends with a line under its last item. Remove any CSS that hid the trailing line. ([#24](https://github.com/Infisical/cipher/pull/24))
- Rows under `DataTable` `groups` start at depth 0, so only `getRowChildren` rows indent. ([#24](https://github.com/Infisical/cipher/pull/24))
- `DataTable` group header rows use `--cipher-paper` instead of `--cipher-tint`. ([#24](https://github.com/Infisical/cipher/pull/24))
- In a `selectable` grouped `DataTable`, each group row draws a tri-state checkbox that selects every selectable row in the group, children included. ([#28](https://github.com/Infisical/cipher/pull/28))
- Hovering a `Card` grows the `Halftone` pattern outward at the same cell size instead of zooming it, and `halftone-peak-hover` rises to 90% in Light and Dark. ([#27](https://github.com/Infisical/cipher/pull/27))
- Below the 44rem container breakpoint, `Item` badges stay beside the title and only `meta` moves to the end of the title row. Actions with no visible text stay inline at every width. ([#25](https://github.com/Infisical/cipher/pull/25))
- The framed `Card` hint underline covers only the text before the first `Badge` when the title is a fragment. ([#25](https://github.com/Infisical/cipher/pull/25))
- `readBootTheme` follows `prefers-color-scheme` when no preference is stored (it used to fall back to Dark), and `storageKeys` and `keys` accept a single key. ([#25](https://github.com/Infisical/cipher/pull/25))
- `Calendar`: range ends and a single selected day use the `select` fill with the selected border, days between sit on a quiet band, and today is a dot. ([#13](https://github.com/Infisical/cipher/pull/13))

## 0.1.2 (2026-11-13)

### Breaking changes

- Version-free naming, with no aliases kept. `V4Scope` is now `CipherScope` and the `.v4` scope class is `.cipher`. `--v4-*` custom properties are `--cipher-*`, `data-v4-*` attributes are `data-cipher-*`, and `.v4-switcher-*` classes are `.cipher-switcher-*`. ([#10](https://github.com/Infisical/cipher/pull/10))
- The source stylesheet `src/v4.css` is now `src/base.css`. The built `./styles.css` export is unchanged. Registry installs land in `src/components/cipher/`. ([#10](https://github.com/Infisical/cipher/pull/10))
- Hooks and helpers drop their `v4` prefix: `usePortalContainer`, `useCollisionBoundary`, `useToastLayer`, `useScheme`, `useTheme`, `readBootTheme`, `themes`, `defaultTheme`, `legacyThemes`, `toTheme`, `themeScheme`, `themeChain`, `themedValue`, `themeStorage`, and the `Scheme` and `ThemeDefinition` types. ([#10](https://github.com/Infisical/cipher/pull/10))
- `V4_TOASTER_ID` is now `TOASTER_ID` (value `"cipher"`). `useV4ActionBarReserve` is now `useActionBarReport`. `v4LiveOrgPath` is removed. ([#10](https://github.com/Infisical/cipher/pull/10))
- `readBootTheme` and `BootLoader` take storage keys and `allowPreview` from the host (`keys` and `storageKeys`). Defaults are `cipher-scheme`, `cipher-theme` and `cipher-theme-override`; pass your existing keys to keep saved themes. ([#10](https://github.com/Infisical/cipher/pull/10))
- `Card` with `variant="framed"` types `description` as `never`. Use the new `hint` instead. Plain Cards keep `description`. ([#19](https://github.com/Infisical/cipher/pull/19))
- `DocumentationLinkBadge` (`ui/documentation-link-badge`) is replaced by `DocumentationLink` (`ui/documentation-link`): an icon-only link where `subject` is required and `variant` is removed. The `data-slot` and registry item are renamed to `documentation-link`, and PageHeader's badges container is `data-slot="page-header-badges"`. ([#20](https://github.com/Infisical/cipher/pull/20))

### Added

- `Halftone` (`ui/halftone`) and `Card` `backdrop` slot. Hue scopes from `lib/hue` via `--cipher-hue` with `data-hue="subtle" | "pop"`, driving `--cipher-hue-icon`, `-tint`, `-soft` and `-fill`. `<AppShell grain>` paints an opt-in band grain. ([#7](https://github.com/Infisical/cipher/pull/7))
- Framed `Card` takes `hint`: a dotted underline on the title and a plain-text Tooltip on hover and focus. ([#19](https://github.com/Infisical/cipher/pull/19))
- `DocumentationLink` sizes itself to where it sits and takes `size="sm" | "md" | "lg"`, using the new token `--cipher-size-icon-2xl`. ([#20](https://github.com/Infisical/cipher/pull/20))
- `Item` takes `titleLines` to clamp the title and show the full title in a Tooltip. ([#21](https://github.com/Infisical/cipher/pull/21))

### Changed

- An icon-only `Button` with `selected` or `aria-pressed` renders bare, and its filled state takes the product hue. ([#9](https://github.com/Infisical/cipher/pull/9))
- `Item` rows with actions switch layout at a 44rem container query: inline, with the timestamp beside the title, or stacked, with buttons on their own row. Outline rows get 24px insets. ([#21](https://github.com/Infisical/cipher/pull/21))
- Card links are scoped to the card, the pager select is lighter, toasts sit lower, the calendar is bounded, and sheet footers keep their buttons in one row. ([#11](https://github.com/Infisical/cipher/pull/11))

## 0.1.1 (2026-11-13)

### Breaking changes

- Peach becomes the single `light` theme and Pale is retired. `peach` and `pale` still resolve to `light`. ([#6](https://github.com/Infisical/cipher/pull/6))

### Added

- `RadioGroupItem` takes `label` and `description`. ([#3](https://github.com/Infisical/cipher/pull/3))
- `FilterBar` takes `width="fill"` to stretch its search, which is otherwise capped at `size-search-max` (720px). ([#4](https://github.com/Infisical/cipher/pull/4))

### Fixed

- An empty `DataTable` no longer draws its actions column. ([#4](https://github.com/Infisical/cipher/pull/4))
