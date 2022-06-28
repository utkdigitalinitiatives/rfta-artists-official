import Layout from "../../components/layout";
import Artist from "@/components/UTK_Artist/Artist";
import { StyledAbout } from "@/components/UTK_About/AboutHeading.styled"

export default function Index() {
  const artists = [
    {
      name: "Paige Braddock",
      collection: "https://digital.lib.utk.edu/static/iiif/collections/paige_rftaart.json",
      description: "is an Eisner-nominated artist and writer and the Chief Creative Officer at Charles M. Schulz Creative Associates. She is best known for her Eisner-nominated comic strip, Jane’s World, the first gay-themed comic work to receive online distribution by a national media syndicate in the US. Braddock concluded the comic strip after completing its 20-year run in 2018. She has illustrated several Peanuts children’s books. Her other graphic novels for children include the Stinky Cecil series. Braddock is publishing a new line of graphic novels for children with Penguin Kids, titled Peanut, Butter, & Crackers. The second book in the series, Fetch!, is out now. She lives with her wife, Evelyn, and their two dogs and a cat in Sebastopol, California.",
    },
    {
      name: "Charlie Daniel",
      collection: "https://digital.lib.utk.edu/static/iiif/collections/charlie_rftaart.json",
      description: "is an editorial cartoonist whose career is a digest of more than fifty years of local and national politics. Editorial cartoonist at the Knoxville Journal from 1958 until its closure in 1992, Daniel has been adding his wry brand of wit and insight to the Knoxville News Sentinel ever since. In 2011, the beloved editorial cartoonist donated his entire collection of hand-drawn, original cartoons to the UT Libraries, inspiring the 1,500-piece Charlie Daniel Editorial Cartoon Collection now held by the Betsey B. Creekmore Special Collections and University Archives.",
    },
    {
      name: "Marshall Ramsey",
      collection: "https://digital.lib.utk.edu/static/iiif/collections/marshall_rftaart.json",
      description: "is a two-time Pulitzer Prize finalist whose cartoons are syndicated nationally and whose artwork, stories, and posts are frequently shared on social media. (By the way, he got his cartooning start at UT, working at the Daily Beacon.) Marshall is editor-at-large for Mississippi Today, a nonpartisan, nonprofit news and media company. He also hosts a weekly radio program and the television program Conversations on Mississippi Public Broadcasting.",
    },
    {
      name: "Danny Wilson",
      collection: "https://digital.lib.utk.edu/static/iiif/collections/danny_rftaart.json",
      description: "is a freelance illustrator based in Knoxville Tennessee. For almost 40 years he has built a reputation for versatility, illustrating in many different styles and genres. Primarily working as a digital concept artist for event and experiential marketing, Wilson has created work for Disney, Warner Bros., Netflix, Amazon, Coca Cola, HGTV, Taylor Swift and many more. As a poster artist he was selected to create posters for the 2017 and 2018 Chick-fil-A Kickoff Games, The Battle at Bristol (Tennesee vs Virginia Tech; worlds largest college football game) and the Official University of Tennessee 1998 National Championship poster, among others. Through the years he has also worked as a magazine and newspaper illustrator and recently has done athletics branding work for the University of Tennessee Volunteers and the University of Tennessee-Southern Firehawks. Wilson graduated from the University of Tennessee in 1984 with a BFA degree.",
    }
  ];

  return (
    <Layout>
      <StyledAbout>
        <h1>
          About the Project
        </h1>
        <h2>
          Summary
        </h2>
        <p>On November 23, 2016, an uncontained wilderness fire on the summit of Chimney Tops in the Great Smoky Mountains National Park, aided by winds approaching ninety miles-per-hour, jumped the park boundary and descended upon the tourist town of Gatlinburg, wreaking a level of destruction that was later identified as the deadliest wildfire in the eastern US since the 1940s and one of the largest natural disasters in Tennessee history. Fourteen people perished, more than 200 were injured, and thousands were forced to evacuate. Over 17,000 acres were burned and nearly 2,600 buildings and homes were damaged or destroyed. The social, cultural, economic, political, and natural impacts of this event are still being calculated.</p>
        <p>Recording the experiences of those who lived through the tragic events of that day and commemorating the heroism and compassion of the community was the objective of Rising from the Ashes, an oral history project of the University of Tennessee Libraries, with support from the city of Gatlinburg and partnership from the Anna Porter Public Library. Drawing inspiration from the interviews recorded by this project, illustrators Paige Braddock, Marshall Ramsey, and Danny Wilson used their skills as graphic artists to further document the experiences of those who were impacted by these events. This work has been generously supported by a grant from the National Endowment for the Arts, specifically their Our Town program, which funds projects that strengthen communities through artistic and creative engagement.</p>
        <h2>Meet the Artists</h2>
        <Artist artist={artists[0]}/>
        <Artist artist={artists[2]}/>
        <Artist artist={artists[3]}/>
        <Artist artist={artists[1]}/>
        <h2>Funding</h2>
        <p><strong>Funding</strong> This project was made possible in part by the National Endowment for the Arts grant 1863142-42-20.</p>
        <img src="/images/nea.jpg" alt="Anna Porter Public Library Logo" />
      </StyledAbout>
    </Layout>
  );
}
