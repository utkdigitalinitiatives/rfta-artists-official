export default async function handler(req, res) {
  const src = Array.isArray(req.query.src) ? req.query.src[0] : req.query.src;

  if (!src || typeof src !== "string") {
    return res.status(400).json({ message: "Missing src query parameter" });
  }

  let target: URL;
  try {
    target = new URL(src);
  } catch (error) {
    return res.status(400).json({ message: "Invalid image URL" });
  }

  // Restrict proxy usage to the known upstream image host.
  if (target.hostname !== "digital.lib.utk.edu") {
    return res.status(403).json({ message: "Host not allowed" });
  }

  try {
    const upstream = await fetch(target.toString());

    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ message: `Upstream image request failed: ${upstream.status}` });
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    const cacheControl =
      upstream.headers.get("cache-control") || "public, max-age=300";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", cacheControl);

    const arrayBuffer = await upstream.arrayBuffer();
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (error) {
    return res
      .status(502)
      .json({ message: `Failed to proxy image: ${error.message}` });
  }
}
