import { z } from "zod";

function emptyStringToUndefined(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : trimmed;
}

const optionalString = z.preprocess(emptyStringToUndefined, z.string().optional());
const optionalNumber = z
  .preprocess(emptyStringToUndefined, z.coerce.number().min(0).optional())
  .catch(undefined);
const optionalBoolean = z
  .preprocess((value) => {
    const normalizedValue = emptyStringToUndefined(value);

    if (typeof normalizedValue !== "string") {
      return normalizedValue;
    }

    const normalizedBoolean = normalizedValue.toLowerCase();

    if (["1", "on", "true"].includes(normalizedBoolean)) {
      return true;
    }

    if (["0", "false", "off"].includes(normalizedBoolean)) {
      return false;
    }

    return normalizedValue;
  }, z.boolean().optional())
  .catch(undefined);

export const catalogSearchSchema = z.object({
  category: optionalString,
  color: optionalString,
  gender: z
    .preprocess(emptyStringToUndefined, z.enum(["WOMEN", "MEN", "UNISEX"]).optional())
    .catch(undefined),
  max: optionalNumber,
  min: optionalNumber,
  new: optionalBoolean,
  popular: optionalBoolean,
  q: optionalString,
  sale: optionalBoolean,
  size: optionalString,
  sort: z
    .preprocess(
      emptyStringToUndefined,
      z.enum(["featured", "new", "price-asc", "price-desc", "popular"]).optional(),
    )
    .catch(undefined),
});

export type CatalogSearchInput = z.infer<typeof catalogSearchSchema>;
