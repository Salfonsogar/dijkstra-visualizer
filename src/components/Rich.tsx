/** Renderiza texto con tramos **en negrita**. */
export function Rich({ text }: { text: string }) {
  const parts = text.split('**')
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : <span key={index}>{part}</span>,
      )}
    </>
  )
}
