// Token bridge for TypeScript usage in Melody UI.
export const themeTokens = {
  colors: {
    bgPrimary: 'var(--color-bg-primary)',
    bgSurface: 'var(--color-bg-surface)',
    bgElevated: 'var(--color-bg-elevated)',
    accentNeon: 'var(--color-accent-neon)',
    accentGlow: 'var(--color-accent-glow)',
    textPrimary: 'var(--color-text-primary)',
    textSecondary: 'var(--color-text-secondary)',
    textMuted: 'var(--color-text-muted)',
  },
  spacing: {
    xs: 'var(--space-xs)',
    sm: 'var(--space-sm)',
    md: 'var(--space-md)',
    lg: 'var(--space-lg)',
    xl: 'var(--space-xl)',
    x2l: 'var(--space-2xl)',
  },
  typography: {
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    x2l: 'var(--text-2xl)',
    display: 'var(--font-display)',
    body: 'var(--font-body)',
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    full: 'var(--radius-full)',
  },
  transition: {
    fast: 'var(--transition-fast)',
    base: 'var(--transition-base)',
  },
} as const;

export type ThemeTokens = typeof themeTokens;