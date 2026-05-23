"use client";

import { useState } from "react";
import { GripVertical, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TagInputProps = {
  label: string;
  onChange: (value: string[]) => void;
  placeholder?: string;
  value: string[];
};

export function TagInput({ label, onChange, placeholder, value }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  function addItem() {
    const next = draft.trim();

    if (!next || value.includes(next)) {
      setDraft("");
      return;
    }

    onChange([...value, next]);
    setDraft("");
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Input
          className="rounded-none"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          value={draft}
        />
        <Button className="rounded-none" onClick={addItem} type="button" variant="outline">
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <span
            className="inline-flex cursor-grab items-center gap-2 border px-2 py-1 text-xs"
            draggable
            key={item}
            onDragOver={(event) => event.preventDefault()}
            onDragStart={() => setDraggedIndex(index)}
            onDrop={() => {
              if (draggedIndex === null || draggedIndex === index) {
                setDraggedIndex(null);
                return;
              }

              const next = [...value];
              const [moved] = next.splice(draggedIndex, 1);
              next.splice(index, 0, moved);
              onChange(next);
              setDraggedIndex(null);
            }}
          >
            <GripVertical aria-hidden="true" className="size-3 text-muted-foreground" />
            {item}
            <button
              aria-label={`Remove ${item}`}
              onClick={() => onChange(value.filter((current) => current !== item))}
              type="button"
            >
              <X aria-hidden="true" className="size-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
