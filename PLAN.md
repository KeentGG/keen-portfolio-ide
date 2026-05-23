# IDE Theme Implementation Plan

## Design Analysis

### Layout (1512 x 800)
```
┌─────────────────────────────────────────────────────────────┐
│  [🔍 Search files...]  [home.tsx][career.tsx]  [🔍 Search] │  ← Top Bar (row-reverse, gap 50)
├────┬────────────────────────────────────────────┬───────────┤
│    │ ────────── (separator) ────────────────── │           │
│ 📁 │  [ Editor | Preview ]                     │           │
│ 🔀 │                                            │           │
│    │  Keanu Kent Gargar                         │           │
│ ── │  // Sr. frontend engineer                  │           │
│ KE │                                            │           │
│ EN │  I'm a frontend engineer that builds       │   (300px) │
│    │  intuitive tools designed to be invisible  │  Right    │
│    │  in your workflow.                         │  Sidebar  │
│    │  → Empowering companies in aligning...     │           │
│    │                                            │           │
├────┴────────────────────────────────────────────┴───────────┤
│  10:04pm                                                    │  ← Status Bar
└─────────────────────────────────────────────────────────────┘
```

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `bg-deep` | `#0c101e` | Main editor, sidebar, right panel backgrounds |
| `bg-shell` | `#0e1324` | Editor switch pill background |
| `bg-active-tab` | `#18203a` | Active tab (Preview) background |
| `bg-surface` | `#121728` | Editor switch border |
| `bg-muted` | `#1f212d` | Arrow/separator strokes |
| `border-subtle` | `#9eade10D` | Tab bar border (8% opacity) |
| `border-separator` | `#7881a3` | Section separators (7-10% opacity) |
| `border-panel` | `#0c101e` | Panel edge separators (60% opacity) |
| `text-primary` | `#bec2d6` | Name, main tagline |
| `text-secondary` | `#b0bff2` | Editor/Preview toggle labels (80-100%) |
| `text-muted` | `#b4b8d1` | Tab labels, search placeholder (60-100%) |
| `text-dim` | `#7881a3` | KEEN-PORTFOLIO label |
| `text-accent` | `#3f677d` | Job title, `//` comment marker |
| `text-ghost` | `#414966` | Sub-tagline |
| `text-time` | `#7cc6f4` | Status bar time (40% opacity) |
| `icon-blue` | `#1c568a` | Sidebar icons (folder, git) |
| `icon-muted` | `#656e8c` | Utility icons (search, arrows) |
| `gradient-start` | `#2899de` @ 10% | Background gradient top-left |
| `gradient-end` | `#11145e` @ 60% | Background gradient bottom-right |

### Typography
| Role | Font | Size | Weight | Color |
|------|------|------|--------|-------|
| Main tagline | Sora | 28px | 100 (Thin) | `#bec2d6` |
| Name | Sora | 16px | 200 (ExtraLight) | `#bec2d6` |
| Job title / `//` | Sora | 16px | 200 | `#3f677d` |
| Sub-tagline | Sora | 16px | 200 | `#414966` |
| Status bar time | Sora | 12px | 300 (Light) | `#7cc6f4` @ 40% |
| Editor/Preview tabs | Host Grotesk | 12px | 300 | `#b0bff2` |
| File tabs (home.tsx) | Host Grotesk | 12px | 400 | `#b4b8d1` |
| Search placeholder | Host Grotesk | 12px | 400 | `#b4b8d1` @ 60% |
| KEEN-PORTFOLIO | Host Grotesk | 10px | 400 | `#7881a3` |

### Spacing System
- Panel gaps: **1px** (shell → sidebar/main/right)
- Tab bar gap: **6px** between tabs
- Search bar padding: **8px** all sides
- Main content: **128px** top/bottom padding, **32px** row gap
- Sidebar icons: **16px** gap, **18px** horizontal padding
- Editor switch pill: **4px** padding, **4px** gap between buttons
- Active tab padding: **12px** horizontal, **6px** vertical
- Status bar time: bottom-right corner

### Key UI Components
1. **Editor Switch** — Pill-shaped toggle (`border-radius: 32px`), Editor/Preview modes
2. **File Tabs** — `.tsx` file tabs with close button, icon, and label
3. **Search Bar** — Rounded input with magnifying glass icon
4. **Primary Sidebar** — Folder + git icons, project name label
5. **Main Editor** — Content area with centered portfolio content
6. **Right Sidebar** — Empty panel (300px, border-radius 8)
7. **Status Bar** — Time display bottom-right
8. **Separators** — Thin paths (0.01px wide/tall) with subtle stroke

---

## Implementation Phases

### Phase 1: Design Tokens & Theme Foundation ✅
**Goal:** Establish the design system as Tailwind CSS custom properties + theme config

- [x] Add Google Fonts: **Sora** (weights: 100, 200, 300) + **Host Grotesk** (weights: 300, 400)
- [x] Create `src/theme/tokens.css` with CSS custom properties for all colors
- [x] Configure Tailwind @theme with custom colors, fonts, spacing, radius
- [x] Set global body styles: dark background, font defaults

### Phase 2: Editor Shell — Layout Skeleton ✅
**Goal:** Build the 3-column IDE layout with all panels

- [x] `EditorShell` — Main container (gradient background)
- [x] `TopBar` — Search bars + file tabs row (flex row-reverse, gap 50)
- [x] `PrimarySidebar` — Left icon strip (250px, flex column, gap 4)
- [x] `MainEditor` — Center content area (flex: 1, rounded-ide-panel)
- [x] `RightSidebar` — Right panel (300px)
- [x] `StatusBar` — Bottom bar with time display
- [x] Panel separators (1px gaps with subtle borders)

### Phase 3: Editor Shell — Chrome & Components ✅
**Goal:** Build the IDE UI chrome (tabs, toggle, search, icons)

- [x] `EditorSwitch` — Pill toggle (Editor | Preview) with active state
- [x] `FileTab` — Tab component with label and close button
- [x] `SearchBar` — Rounded input with magnifying glass icon (Phosphor)
- [x] `SidebarIcons` — Folder + git-pull-request icons (Phosphor)
- [x] `ProjectLabel` — "KEEN-PORTFOLIO" label component

### Phase 4: Preview Mode (Landing Page Content) ✅
**Goal:** Port existing landing page content into the IDE shell's Preview mode

- [x] Move current `App.tsx` content into `PreviewPane` component
- [x] Retain ALL existing animation logic (headline word reveal, stagger, blur)
- [x] Center content with 128px top/bottom padding, 32px row gap
- [x] Typography: name (Sora 16px/200), `//` + title (Sora 16px/200), tagline (Sora 28px/100)
- [x] Wire Editor/Preview toggle to switch between modes

### Phase 5: Editor Mode (Code View) ✅
**Goal:** Build the "Editor" view — a faux code editor showing portfolio source

- [x] Syntax-highlighted code display (portfolio content as TSX)
- [x] Line numbers gutter
- [x] Mimic VS Code color scheme (monokai-ish keywords, strings, props)
- [x] Blinking cursor

### Phase 6: Right Sidebar Content
**Goal:** Fill the right panel with contextual content

- [ ] Terminal / output panel
- [ ] Extensions / info panel
- [ ] Or: mini project showcase / links panel

### Phase 7: Responsive & Polish
**Goal:** Make it work at different viewports, add interactions

- [ ] Responsive breakpoints (stack panels on mobile)
- [ ] Hover states on tabs, icons, toggle
- [ ] Transition animations between Editor/Preview modes
- [ ] Keyboard shortcuts (Cmd+E for editor, Cmd+P for preview)
