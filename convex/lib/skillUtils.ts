type RawSkillItem =
  | string
  | {
      brandColor?: string;
      iconSlug?: string;
      id?: string;
      name?: string;
    };

type RawSkillCategory = {
  id?: string;
  name?: string;
  order?: number;
  skills?: RawSkillItem[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeHexColor(value?: string) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return "";
  }

  const withoutHash = trimmed.replace(/^#/, "");
  return /^([0-9a-fA-F]{6})$/.test(withoutHash) ? `#${withoutHash.toUpperCase()}` : trimmed;
}

export function normalizeSkillItem(value: RawSkillItem, index = 0) {
  const raw = typeof value === "string" ? { name: value } : value;
  const name = raw.name?.trim() || "Skill";
  const fallbackId = `${slugify(name) || "skill"}-${index}`;

  return {
    brandColor: normalizeHexColor(raw.brandColor),
    iconSlug: raw.iconSlug?.trim() ?? "",
    id: raw.id?.trim() || fallbackId,
    name,
  };
}

export function normalizeSkillCategories(categories: RawSkillCategory[] = []) {
  return categories.map((category, categoryIndex) => {
    const name = category.name?.trim() || "Skills";

    return {
      id: category.id?.trim() || `${slugify(name) || "skills"}-${categoryIndex}`,
      name,
      order: category.order ?? categoryIndex,
      skills: (category.skills ?? []).map((skill, skillIndex) =>
        normalizeSkillItem(skill, skillIndex),
      ),
    };
  });
}
