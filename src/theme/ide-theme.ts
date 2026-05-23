/**
 * IDE Theme — TypeScript design tokens
 *
 * Mirrors src/theme/tokens.css for use in JS/TS code
 * (animation configs, inline styles, dynamic theming).
 *
 * CSS custom properties are the source of truth for styling.
 * Use this object when you need token values in logic.
 */

export const ideTheme = {
  colors: {
    bg: {
      deep:       '#0c101e',
      shell:      '#0e1324',
      activeTab:  '#18203a',
      surface:    '#121728',
      muted:      '#1f212d',
      overlay:    '#0c101e99',
    },
    text: {
      primary:   '#bec2d6',
      secondary: '#b0bff2',
      muted:     '#b4b8d1',
      dim:       '#7881a3',
      accent:    '#3f677d',
      ghost:     '#414966',
      time:      '#7cc6f4',
    },
    icon: {
      blue:  '#1c568a',
      muted: '#656e8c',
    },
    border: {
      subtle:    '#9eade1',
      separator: '#7881a3',
    },
    gradient: {
      start: '#2896de',
      end:   '#11145e',
    },
  },

  fonts: {
    sora:        '"Sora", sans-serif',
    hostGrotesk: '"Host Grotesk", sans-serif',
  },

  fontWeight: {
    thin:       100,
    extraLight: 200,
    light:      300,
    regular:    400,
  },

  fontSize: {
    xs:   '10px',  // KEEN-PORTFOLIO label
    sm:   '12px',  // Tabs, search, toggle, status bar
    base: '16px',  // Name, title, sub-tagline
    lg:   '28px',  // Main tagline
  },

  spacing: {
    panelGap:   '1px',
    tabGap:     '6px',
    searchPad:  '8px',
    contentPx:  '128px',
    contentGap: '32px',
    sidebarGap: '16px',
    sidebarPx:  '18px',
    pillPad:    '4px',
    tabPadX:    '12px',
    tabPadY:    '6px',
  },

  radius: {
    panel:  '8px',
    pill:   '32px',
    tab:    '16px',
    button: '6px',
    sm:     '4px',
  },

  /** Text opacity values used in the design */
  opacity: {
    textTime:     0.4,
    textSecondary: 0.8,
    textMuted:    0.6,
    textDim:      1,
    iconGit:      0.6,
    borderSubtle: 0.07,
    borderPanel:  0.6,
  },
} as const

/** Helper: get a CSS variable reference for use in inline styles */
export const cssVar = (name: string) => `var(--ide-${name})`
