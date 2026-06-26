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
    const upstream = await fetch(target.toString(), {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      },
    });

    if (!upstream.ok) {
      res.setHeader("Cache-Control", "public, max-age=120");
      return res.redirect(302, "/images/placeholder.png");
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    if (!contentType.toLowerCase().startsWith("image/")) {
      // Upstream may return anti-bot HTML instead of image bytes.
      res.setHeader("Cache-Control", "public, max-age=120");
      return res.redirect(302, "/images/placeholder.png");
    }

    const cacheControl =
      upstream.headers.get("cache-control") || "public, max-age=300";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", cacheControl);

    const arrayBuffer = await upstream.arrayBuffer();
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (error) {
    res.setHeader("Cache-Control", "public, max-age=120");
    return res.redirect(302, "/images/placeholder.png");
  }
}
