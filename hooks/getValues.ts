import { InternationalString } from "@hyperion-framework/types";

// Get string from a IIIF pres 3 label by language code
export const getValues = (
  values: InternationalString,
  language: string = "none"
) => {
  if (!values) return ["Untitled"];
  if (typeof values === "string") return [values];
  if (Array.isArray(values)) return values;

  const valuesMap = values as Record<string, string[]>;

  /*
   * If InternationalString code does not exist on label, then
   * return what may be there, ex: label.none[0] OR label.fr[0]
   */
  if (!valuesMap[language]) {
    const codes: Array<string> = Object.getOwnPropertyNames(valuesMap);
    if (codes.length > 0) return valuesMap[codes[0]];
  }

  /*
   * Return label value for InternationalString code `en`
   */
  return valuesMap[language];
};
