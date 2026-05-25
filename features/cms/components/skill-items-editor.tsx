"use client";

import { ExternalLink, GripVertical, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  normalizeHexColor,
  normalizeSkillItems,
  type SkillItem,
} from "@/features/cms/schemas";
import {
  getVisibleSkillIconColor,
  SkillIcon,
} from "@/features/portfolio/components/skill-icon";

type SkillItemsEditorProps = {
  label?: string;
  onChange: (value: SkillItem[]) => void;
  value?: Array<SkillItem | string>;
};

function newSkillItem(): SkillItem {
  return {
    brandColor: "",
    iconSlug: "",
    id: crypto.randomUUID(),
    name: "",
  };
}

function colorInputValue(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#FFFFFF";
}

export function SkillItemsEditor({ label = "Skill items", onChange, value }: SkillItemsEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const skills = useMemo(() => normalizeSkillItems(value ?? []), [value]);

  function commit(nextSkills: SkillItem[]) {
    onChange(nextSkills);
  }

  function updateSkill(index: number, patch: Partial<SkillItem>) {
    commit(
      skills.map((skill, skillIndex) =>
        skillIndex === index
          ? {
              ...skill,
              ...patch,
            }
          : skill,
      ),
    );
  }

  function removeSkill(index: number) {
    commit(skills.filter((_, skillIndex) => skillIndex !== index));
  }

  function moveSkill(from: number, to: number) {
    const nextSkills = [...skills];
    const [moved] = nextSkills.splice(from, 1);
    nextSkills.splice(to, 0, moved);
    commit(nextSkills);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <Label>{label}</Label>
          <a
            className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground underline-offset-4 hover:underline"
            href="https://simpleicons.org/"
            rel="noreferrer"
            target="_blank"
          >
            simpleicons.org icon slugs
            <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        </div>
        <Button
          className="min-h-11 rounded-none"
          onClick={() => commit([...skills, newSkillItem()])}
          type="button"
          variant="outline"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add Skill
        </Button>
      </div>

      <div className="space-y-2">
        {skills.map((skill, index) => {
          const previewColor = getVisibleSkillIconColor(skill.name || "Skill", skill.iconSlug, skill.brandColor);

          return (
            <div
              className="grid gap-3 border bg-background p-3 lg:grid-cols-[auto_44px_minmax(0,1fr)_minmax(0,1fr)_160px_auto]"
              draggable
              key={`${skill.id}-${index}`}
              onDragOver={(event) => event.preventDefault()}
              onDragStart={() => setDraggedIndex(index)}
              onDrop={() => {
                if (draggedIndex !== null && draggedIndex !== index) {
                  moveSkill(draggedIndex, index);
                }
                setDraggedIndex(null);
              }}
            >
              <button
                aria-label={`Drag ${skill.name || "skill"}`}
                className="flex min-h-11 items-center justify-center text-muted-foreground"
                type="button"
              >
                <GripVertical aria-hidden="true" className="size-4" />
              </button>
              <div className="flex size-11 items-center justify-center border border-[#333] bg-[#101010]">
                <SkillIcon
                  color={previewColor}
                  iconSlug={skill.iconSlug}
                  name={skill.name || "Skill"}
                  size={24}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Name</Label>
                <Input
                  className="min-h-11 rounded-none"
                  onChange={(event) => updateSkill(index, { name: event.target.value })}
                  placeholder="React"
                  value={skill.name}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Icon slug</Label>
                <Input
                  className="min-h-11 rounded-none font-mono"
                  onChange={(event) => updateSkill(index, { iconSlug: event.target.value })}
                  placeholder="react"
                  value={skill.iconSlug}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Brand color</Label>
                <div className="grid grid-cols-[44px_1fr] gap-2">
                  <input
                    aria-label={`${skill.name || "Skill"} brand color picker`}
                    className="h-11 w-11 border border-input bg-background"
                    onChange={(event) =>
                      updateSkill(index, { brandColor: normalizeHexColor(event.target.value) })
                    }
                    type="color"
                    value={colorInputValue(skill.brandColor)}
                  />
                  <Input
                    className="min-h-11 rounded-none font-mono"
                    onChange={(event) => updateSkill(index, { brandColor: event.target.value })}
                    placeholder="#61DAFB"
                    value={skill.brandColor}
                  />
                </div>
              </div>
              <Button
                aria-label={`Remove ${skill.name || "skill"}`}
                className="min-h-11 rounded-none self-end"
                onClick={() => removeSkill(index)}
                size="icon"
                type="button"
                variant="outline"
              >
                <Trash2 aria-hidden="true" className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
