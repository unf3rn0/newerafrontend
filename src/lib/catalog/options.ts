import type { Locale } from "@/lib/i18n/config";
import type { LocalizedText } from "@/lib/catalog/types";

export const sizeOptions = ["XS", "S", "M", "L", "XL"];

export const colorOptions = [
  { label: { en: "Blue", ru: "Голубой", tg: "Кабуд" }, value: "blue" },
  { label: { en: "White", ru: "Белый", tg: "Сафед" }, value: "white" },
  { label: { en: "Graphite", ru: "Графит", tg: "Графит" }, value: "black" },
  { label: { en: "Stone", ru: "Камень", tg: "Сангӣ" }, value: "stone" },
  { label: { en: "Grey", ru: "Серый", tg: "Хокистарӣ" }, value: "grey" },
] satisfies Array<{ label: LocalizedText; value: string }>;

const colorHexByValue: Record<string, string> = {
  black: "#111827",
  blue: "#d7eefe",
  grey: "#dfe8ef",
  stone: "#d8d2c4",
  white: "#ffffff",
};

function localized(value: string): LocalizedText {
  return { en: value, ru: value, tg: value };
}

function getColorValue(color: string) {
  const normalized = color.toLowerCase();

  if (
    normalized.includes("aqua") ||
    normalized.includes("blue") ||
    normalized.includes("frost") ||
    normalized.includes("ice") ||
    normalized.includes("mist") ||
    normalized.includes("sky")
  ) {
    return "blue";
  }

  if (
    normalized.includes("pearl") ||
    normalized.includes("porcelain") ||
    normalized.includes("white")
  ) {
    return "white";
  }

  if (
    normalized.includes("black") ||
    normalized.includes("graphite") ||
    normalized.includes("ink")
  ) {
    return "black";
  }

  if (normalized.includes("cloud") || normalized.includes("grey")) {
    return "grey";
  }

  if (normalized.includes("stone")) {
    return "stone";
  }

  return normalized.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "custom";
}

export function mapProductColor(color: string) {
  const value = getColorValue(color);

  return {
    hex: colorHexByValue[value] ?? "#e8f4ff",
    name: localized(color),
    value,
  };
}

export function getColorLabel(value: string, locale: Locale) {
  return colorOptions.find((color) => color.value === value)?.label[locale] ?? value;
}
