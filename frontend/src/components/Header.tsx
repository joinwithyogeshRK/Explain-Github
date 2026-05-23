import { motion } from "framer-motion"
import { Menu, Plus } from "lucide-react"
import { Show, UserButton } from "@clerk/react"
import { AuthSection } from "./AuthSection"
import { GithubOAuth } from "./GithubOAuth"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { getClerkAppearance } from "@/lib/clerk-appearance"
import { useTheme } from "@/context/ThemeProvider"

interface Props {
  chatId: string | null
  file: File | null
  fileName: string
  onRemoveFile: () => void
  onNewChat: () => void
  onOpenSidebar: () => void
}

const iconBtn =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:h-9 sm:w-9"

export const Header = ({
  chatId,
  file,
  fileName,
  onRemoveFile,
  onNewChat,
  onOpenSidebar,
}: Props) => {
  const { theme } = useTheme()
  const clerkAppearance = getClerkAppearance(theme)

  return (
    <motion.header
      className="mb-3 flex shrink-0 flex-col gap-2 sm:mb-5 sm:gap-0"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3.5">
          <motion.button
            type="button"
            onClick={onOpenSidebar}
            className={iconBtn}
            whileTap={{ scale: 0.95 }}
            aria-label="Open chat history"
          >
            <Menu className="h-4 w-4" />
          </motion.button>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
              <motion.div
                className="absolute inset-0 rounded-full border border-transparent border-t-accent border-r-accent/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              <div className="h-4 w-4 rounded-full bg-accent shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_40%,transparent)] sm:h-[18px] sm:w-[18px]" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-bold tracking-[0.2em] text-accent sm:text-sm sm:tracking-[0.28em]">
                ORACLE
              </div>
              <div className="hidden truncate text-[9px] tracking-[0.14em] text-muted-foreground sm:mt-0.5 md:block">
                RAG Intelligence Engine
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <motion.button
            type="button"
            onClick={onNewChat}
            className={iconBtn}
            whileTap={{ scale: 0.95 }}
            aria-label="New chat"
            title="New chat"
          >
            <Plus className="h-4 w-4" />
          </motion.button>

          <ThemeToggle className="h-10 w-10 sm:h-9 sm:w-9" />

          <Show when="signed-in">
            <GithubOAuth />
            <UserButton
              appearance={{
                ...clerkAppearance,
                elements: {
                  ...clerkAppearance.elements,
                  userButtonAvatarBox: { width: 32, height: 32 },
                },
              }}
            />
          </Show>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {chatId && (
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-accent/80 sm:px-2.5 sm:py-1 sm:text-[10px]">
              #{chatId.slice(0, 8)}
            </span>
          )}
          {file && (
            <span className="flex max-w-[120px] items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 sm:max-w-[140px] sm:px-2.5 sm:py-1">
              <span className="truncate font-mono text-[9px] text-success sm:text-[10px]">
                {fileName}
              </span>
              <button
                type="button"
                onClick={onRemoveFile}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Remove file"
              >
                ×
              </button>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <AuthSection />
        </div>
      </div>
    </motion.header>
  )
}
