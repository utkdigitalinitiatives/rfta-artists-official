const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

export default async (req, res) => {
  // An array with your links
  const links = [
    { url: "/index", changefreq: "daily", priority: 0.3 },
    { url: "/artists", changefreq: "daily", priority: 0.3 },
    { url: "/works/the-home-of-stacey-adam-and-chris-szaton-is-still-standing", changefreq: "daily", priority: 0.3 },
    { url: "/works/stacey-adam-and-chris-szaton-evacuate", changefreq: "daily", priority: 0.3 },
    { url: "/works/the-wildfires", changefreq: "daily", priority: 0.3 },
    { url: "/works/a-family-embraces-their-well-being", changefreq: "daily", priority: 0.3 },
    { url: "/works/a-salute-from-smokey-the-bear", changefreq: "daily", priority: 0.3 },
    { url: "/works/children-ask-for-santas-help", changefreq: "daily", priority: 0.3 },
    { url: "/works/the-chimney-tops-2-fire", changefreq: "daily", priority: 0.3 },
    { url: "/works/the-perfect-storm", changefreq: "daily", priority: 0.3 },
    { url: "/works/relentless-flames-take-over-gatlinburg", changefreq: "daily", priority: 0.3 },
    { url: "/works/erik-dobell-wakes-up-to-the-fire", changefreq: "daily", priority: 0.3 },
    { url: "/works/gary-ownby-clears-the-road", changefreq: "daily", priority: 0.3 },
    { url: "/works/first-responders-fight-the-fires-and-save-lives", changefreq: "daily", priority: 0.3 },
    { url: "/works/the-rain-comes", changefreq: "daily", priority: 0.3 },
    { url: "/works/mountain-tough", changefreq: "daily", priority: 0.3 },
    { url: "/works/school-children-want-to-return-to-normal-life", changefreq: "daily", priority: 0.3 },
    { url: "/works/dolly-parton-donates", changefreq: "daily", priority: 0.3 },
    { url: "/works/remembering-the-lives-lost-to-the-fires", changefreq: "daily", priority: 0.3 },
    { url: "/works/firetruck-warning", changefreq: "daily", priority: 0.3 },
    { url: "/works/news-updates", changefreq: "daily", priority: 0.3 },
    { url: "/works/susan-melchors-evacuation-and-return", changefreq: "daily", priority: 0.3 },
    { url: "/works/topper", changefreq: "daily", priority: 0.3 },
    { url: "/works/just-a-manual", changefreq: "daily", priority: 0.3 },
    { url: "/works/a-dog-left-behind", changefreq: "daily", priority: 0.3 },
    { url: "/works/bob-sweeney-prays", changefreq: "daily", priority: 0.3 },
    { url: "/works/motorcycle", changefreq: "daily", priority: 0.3 },
    { url: "/works/leading-the-way-out-of-the-fire", changefreq: "daily", priority: 0.3 },
    { url: "/works/charlie-anderson-returns-to-the-remains-of-his-resort", changefreq: "daily", priority: 0.3 },
    { url: "/works/equal-opportunity-destroyer", changefreq: "daily", priority: 0.3 },
    { url: "/works/lone-cabin", changefreq: "daily", priority: 0.3 },
    { url: "/works/the-great-smoky-mountains-church-of-christ-as-a-beacon-of-hope", changefreq: "daily", priority: 0.3 },
    { url: "/works/church", changefreq: "daily", priority: 0.3 },
    { url: "/works/the-effects-of-the-wildfires-on-water-and-soil", changefreq: "daily", priority: 0.3 },
    { url: "/works/santa-biblia", changefreq: "daily", priority: 0.3 },
    { url: "/works/return-of-the-table-mountain-pines", changefreq: "daily", priority: 0.3 },
    { url: "/works/no-children-at-recess", changefreq: "daily", priority: 0.3 },
    { url: "/works/precious-items-left-during-evacuation", changefreq: "daily", priority: 0.3 },
    { url: "/works/animal-rescue", changefreq: "daily", priority: 0.3 },
    { url: "/works/russell-biven-reports-the-local-disaster", changefreq: "daily", priority: 0.3 },
    { url: "/works/smoky-classroom-windows", changefreq: "daily", priority: 0.3 },
    { url: "/works/the-smoke-reaches-gatlinburg-valley", changefreq: "daily", priority: 0.3 },
    { url: "/works/stephanie-sweeney-recovers-her-grandmothers-cast-iron-skillets", changefreq: "daily", priority: 0.3 },
    { url: "/works/the-kindness-of-strangers", changefreq: "daily", priority: 0.3 },
    { url: "/works/escaping-the-fire", changefreq: "daily", priority: 0.3 },
  ];

  // Create a stream to write to
  const stream = new SitemapStream({ hostname: `https://${req.headers.host}` });

  res.writeHead(200, {
    "Content-Type": "application/xml",
  });

  const xmlString = await streamToPromise(
    Readable.from(links).pipe(stream)
  ).then((data) => data.toString());
  res.end(xmlString);
};