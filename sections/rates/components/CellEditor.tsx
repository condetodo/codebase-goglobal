import { useState, useEffect, useRef } from 'react'
import type { CellEditorProps } from '../types'

export function CellEditor({ value, onSave, onCancel }: CellEditorProps) {
  const [editValue, setEditValue] = useState(value.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numValue = parseFloat(editValue)
    if (!isNaN(numValue) && numValue >= 0) {
      onSave?.(numValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel?.()
    } else if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        ref={inputRef}
        type="number"
        step="0.01"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 border-2 border-blue-900 dark:border-blue-800 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none"
      />
    </form>
  )
}


