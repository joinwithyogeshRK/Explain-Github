import { dark } from "@clerk/themes"
import type { Theme } from "@/context/ThemeProvider"

const ACCENT = "#c9a84c"
const ACCENT_FG = "#08080a"

/** Clerk modal, UserButton popover, and UserProfile — synced with app light/dark themes. */
export function getClerkAppearance(theme: Theme) {
  const isDark = theme === "dark"

  const text = isDark ? "#e8e8f0" : "#12121a"
  const textMuted = isDark ? "#a8a8bc" : "#6b6b7a"
  const surface = isDark ? "#0f0f14" : "#ffffff"
  const surfaceMuted = isDark ? "#14141c" : "#f8f8fa"
  const border = isDark ? "#1e1e2a" : "#e4e4ec"

  return {
    baseTheme: isDark ? dark : undefined,
    variables: {
      colorBackground: surface,
      colorInputBackground: surfaceMuted,
      colorInput: surfaceMuted,
      colorForeground: text,
      colorNeutral: text,
      colorText: text,
      colorTextSecondary: textMuted,
      colorInputForeground: text,
      colorInputText: text,
      colorPrimary: ACCENT,
      colorPrimaryForeground: ACCENT_FG,
      colorDanger: isDark ? "#f87171" : "#ef4444",
      borderRadius: "0.75rem",
      fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
      fontFamilyButtons: '"DM Mono", ui-monospace, monospace',
    },
    elements: {
      modalBackdrop: { backdropFilter: "blur(6px)" },
      card: {
        backgroundColor: surface,
        border: `1px solid ${border}`,
        boxShadow: isDark
          ? "0 24px 80px rgba(0,0,0,0.55)"
          : "0 24px 80px rgba(0,0,0,0.12)",
      },
      headerTitle: { color: text },
      headerSubtitle: { color: textMuted },
      socialButtonsBlockButton: {
        border: `1px solid ${border}`,
        backgroundColor: surfaceMuted,
        color: text,
        "&:hover": {
          backgroundColor: isDark ? "#1a1a24" : "#f0f0f5",
        },
      },
      socialButtonsBlockButtonText: {
        color: text,
        fontFamily: '"DM Mono", ui-monospace, monospace',
        fontSize: "12px",
        letterSpacing: "0.04em",
      },
      formButtonPrimary: {
        backgroundColor: ACCENT,
        color: ACCENT_FG,
        "&:hover": { backgroundColor: "#b89940" },
      },
      formFieldLabel: { color: textMuted },
      formFieldInput: { color: text },
      dividerText: { color: textMuted },
      footerActionText: { color: textMuted },
      footerActionLink: { color: ACCENT },
      identityPreviewText: { color: text },
      identityPreviewEditButtonIcon: { color: textMuted },

      /* UserButton dropdown */
      userButtonPopoverCard: {
        backgroundColor: surface,
        border: `1px solid ${border}`,
        boxShadow: isDark ? "0 16px 48px rgba(0,0,0,0.5)" : "0 16px 48px rgba(0,0,0,0.1)",
      },
      userButtonPopoverMain: { backgroundColor: surface },
      userButtonPopoverActions: { borderColor: border },
      userButtonPopoverActionButton: {
        color: text,
        "&:hover": {
          backgroundColor: isDark ? "#1a1a24" : "#f0f0f5",
        },
      },
      userButtonPopoverActionButtonText: { color: text, fontWeight: 500 },
      userButtonPopoverActionButtonIcon: { color: textMuted },
      userButtonPopoverFooter: {
        backgroundColor: isDark ? "#14141c" : "#f8f8fa",
        borderTop: `1px solid ${border}`,
      },
      userPreviewMainIdentifier: { color: text, fontWeight: 600 },
      userPreviewSecondaryIdentifier: { color: textMuted },

      /* UserProfile modal (Manage account) */
      rootBox: { color: text },
      modalContent: { backgroundColor: surface, color: text },
      navbar: {
        backgroundColor: isDark ? "#0c0c10" : "#f8f8fa",
        borderRight: `1px solid ${border}`,
      },
      navbarButton: {
        color: textMuted,
        "&:hover": {
          backgroundColor: isDark ? "#1a1a24" : "#f0f0f5",
          color: text,
        },
      },
      navbarButtonIcon: { color: "inherit" },
      navbarButtonText: { color: "inherit" },
      navbarButton__active: {
        backgroundColor: isDark ? "#1a1a24" : "#f0f0f5",
        color: ACCENT,
      },
      pageScrollBox: { backgroundColor: surface },
      page: { backgroundColor: surface },
      profilePage: { color: text },
      profileSection: { borderColor: border },
      profileSectionTitle: { color: text },
      profileSectionTitleText: { color: text, fontWeight: 600 },
      profileSectionSubtitle: { color: textMuted },
      profileSectionContent: { color: text },
      profileSectionPrimaryButton: { color: ACCENT },
      badge: {
        color: textMuted,
        borderColor: border,
        backgroundColor: surfaceMuted,
      },
      menuButton: { color: text },
      menuList: { backgroundColor: surface, borderColor: border },
      menuItem: { color: text },
      accordionTriggerButton: { color: text },
      tableHead: { color: textMuted },
      tableCell: { color: text },
    },
  }
}
