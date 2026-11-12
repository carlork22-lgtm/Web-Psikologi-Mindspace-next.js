'use client'

export default function OpenBotButton({
  className = '',
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  function handleOpen() {
    try {
      localStorage.setItem('mindspace_bot_dismissed', 'false')
    } catch {}
    window.dispatchEvent(new CustomEvent('open-mindspace-bot'))
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className={className}
      title="Buka asisten virtual MindBot"
    >
      {children ?? (
        <>
          <span>Buka Chatbot MindSpace</span>
          <span className="ml-1.5">&rarr;</span>
        </>
      )}
    </button>
  )
}
