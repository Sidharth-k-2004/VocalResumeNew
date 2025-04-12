"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface EditableFieldProps {
  value: string
  onChange: (value: string) => void
  isEditable: boolean
  className?: string
  multiline?: boolean
}

export function EditableField({ value, onChange, isEditable, className, multiline = false }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    if (isEditable) {
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    onChange(editValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      setIsEditing(false)
      onChange(editValue)
    }
    if (e.key === "Escape") {
      setIsEditing(false)
      setEditValue(value)
    }
  }

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary",
            className,
          )}
          rows={3}
        />
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary",
          className,
        )}
      />
    )
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className={cn(isEditable ? "cursor-pointer hover:bg-gray-100 rounded px-1 -mx-1" : "", className)}
      title={isEditable ? "Double-click to edit" : ""}
    >
      {value}
    </span>
  )
}
