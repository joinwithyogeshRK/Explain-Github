import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Plus, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Chat {
  id: string
  title: string
  created_at: string
}

interface Props {
  open: boolean
  chats: Chat[]
  activeChatId: string | null
  loading: boolean
  onClose: () => void
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string, e: React.MouseEvent) => void
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

export const Sidebar = ({
  open,
  chats,
  activeChatId,
  loading,
  onClose,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: Props) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.aside
          className="fixed bottom-0 left-0 top-0 z-20 flex w-[min(300px,88vw)] flex-col border-r border-border bg-card shadow-2xl"
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-5">
            <span className="font-mono text-[10px] font-semibold tracking-[0.25em] text-accent">
              CHAT HISTORY
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onNewChat()
              onClose()
            }}
            className="mx-3 mt-3 flex items-center gap-2 rounded-xl border border-dashed border-border px-3.5 py-2.5 font-mono text-[10px] font-semibold tracking-wider text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Plus className="h-3 w-3" />
            NEW CHAT
          </button>

          <div className="mx-3 my-3 h-px bg-border" />

          <div className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-4">
            {loading ? (
              <div className="flex flex-col gap-2 p-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-14 rounded-xl bg-muted"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            ) : chats.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-muted-foreground">
                No previous chats
              </p>
            ) : (
              chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectChat(chat.id)}
                  onKeyDown={(e) => e.key === "Enter" && onSelectChat(chat.id)}
                  className={cn(
                    "relative mb-0.5 cursor-pointer rounded-xl px-3 py-2.5 transition-colors hover:bg-muted",
                    activeChatId === chat.id && "bg-muted"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-foreground">{chat.title}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">
                        {formatDate(chat.created_at)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => onDeleteChat(chat.id, e)}
                      className="rounded-md p-1 text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                      title="Delete chat"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  {activeChatId === chat.id && (
                    <div className="absolute bottom-[20%] left-0 top-[20%] w-0.5 rounded-r bg-accent" />
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
)
