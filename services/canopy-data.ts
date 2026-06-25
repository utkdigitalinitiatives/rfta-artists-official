import fs from "fs";
import path from "path";

const readCanopyJson = <T>(filename: string, fallback: T): T => {
  try {
    const filePath = path.join(process.cwd(), ".canopy", filename);
    if (!fs.existsSync(filePath)) return fallback;

    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Failed to load .canopy/${filename}:`, error);
    return fallback;
  }
};

export type CanopyCollection = {
  id?: string;
  label?: string[];
  items?: Array<Record<string, any>>;
};

export type CanopyManifest = {
  collectionId?: string;
  id: string;
  label: string[];
  slug: string;
};

export type CanopyMetadata = {
  manifestId: string;
  label: string;
  value: string;
  thumbnail: string;
};

export const getCanopyCollections = () =>
  readCanopyJson<CanopyCollection[]>("collections.json", []);

export const getCanopyManifests = () =>
  readCanopyJson<CanopyManifest[]>("manifests.json", []);

export const getCanopyMetadata = () =>
  readCanopyJson<CanopyMetadata[]>("metadata.json", []);
