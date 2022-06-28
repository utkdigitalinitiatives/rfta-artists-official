/**
 * Configuration built by `npm run build`
 */
exports.prod = {
  collection:
    "https://digital.lib.utk.edu/assemble/collection/collections/rftacuratedart",
  title:
    "Rising from the Ashes",
  subtitle: "The Chimney Tops 2 Wildfires in Memory and Art",
  hero: ["https://digital.lib.utk.edu/assemble/manifest/rftaart/76"],
  metadata: ["Artist", "Subject"],
};

/**
 * Configuration built by `npm run dev`
 */
exports.dev = {
  collection:
    "https://digital.lib.utk.edu/assemble/collection/collections/rftacuratedart",
  title:
    "Rising from the Ashes",
  subtitle: "The Chimney Tops 2 Wildfires in Memory and Art",
  hero: ["https://digital.lib.utk.edu/assemble/manifest/rftaart/76"],
  metadata: ["Artist", "Subject"],
};

/**
 * Canopy globals regardless of environment
 */
exports.globals = {
  slugify: {
    lower: true,
    strict: true,
    trim: true,
  },
};

exports.colors = {
  tennesseeOrange: "#FF8200",
  white: "#FFFFFF",
  smokey: "#58595B",
  globe: "#006C93",
  regalia: "#754A7E",
  smokeyX: "#333333",
  valley: "#00746F",
  limestone: "#F0EDE3",
  rock: "#A7A9AC",
  gray1: "#F6F6F6",
  river: "#517C96"
};

exports.fonts = {
  sans: "Gotham, Helvetica, Arial, Sans-serif",
  serif: "Georgia, Times, Times New Roman, Serif",
};
