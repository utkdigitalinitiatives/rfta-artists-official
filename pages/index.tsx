import React, { useState } from "react";
import { gql } from "@apollo/client";
import { client } from "@/pages/api/graphql";
import Layout from "@/components/layout";
import { InView } from "react-intersection-observer";
import { map as lodashMap, groupBy as lodashGroupBy } from "lodash";
import Grid from "@/components/Grid/Grid";
import Head from "next/head";

const RESULT_LIMIT = 20;

export default function Index({ manifests, metadata }) {
  /**
   * @todo make section a component with an isFluid variant and default at max-width 1280
   */

  const [limit, setLimit] = useState(RESULT_LIMIT);
  const [offset, setOffset] = useState(0);
  const [results, setResults] = useState(manifests);

  const handleLoadMore = async () => {
    const newOffset = limit + offset;
    const data = fetchData(newOffset);

    if (data && results.length > 0)
      data.then((response) => {
        setResults(results.concat(response.manifests));
        setOffset(newOffset);
      });
  };

  /**
   * @param offset
   * @returns
   */
  const fetchData = async (offset) => {
    const { loading, error, data } = await client.query({
      query: gql`
        query Manifests {
          manifests(limit: ${RESULT_LIMIT}, offset: ${offset}) {
            id
            label
            slug
            metadata
            collectionId
          }
        }
      `,
    });
    if (data) return data;
  };

  return (
    <Layout>
      <Head>
        <title>Rising from the Ashes Artists: The Chimney Tops 2 Wildfires in Memory and Art</title>
        <meta property="og:title" content="Rising from the Ashes Artists: The Chimney Tops 2 Wildfires in Memory and Art" key="title" />
        <meta property="og:description" content="Recording the experiences of those who lived through the tragic events of that day and commemorating the heroism and compassion of the community was the objective of Rising from the Ashes, an oral history project of the University of Tennessee Libraries, with support from the city of Gatlinburg and partnership from the Anna Porter Public Library. Drawing inspiration from the interviews recorded by this project, illustrators Paige Braddock, Marshall Ramsey, and Danny Wilson used their skills as graphic artists to further document the experiences of those who were impacted by these events. This work has been generously supported by a grant from the National Endowment for the Arts, specifically their Our Town program, which funds projects that strengthen communities through artistic and creative engagement." key="summary" />
        <meta property="og:image" content="https://digital.lib.utk.edu/iiif/2/collections~islandora~object~rftaart%3A8~datastream~TN/full/max/0/default.jpg" key="og-image" />
        <meta name="description" content="Recording the experiences of those who lived through the tragic events of that day and commemorating the heroism and compassion of the community was the objective of Rising from the Ashes, an oral history project of the University of Tennessee Libraries, with support from the city of Gatlinburg and partnership from the Anna Porter Public Library. Drawing inspiration from the interviews recorded by this project, illustrators Paige Braddock, Marshall Ramsey, and Danny Wilson used their skills as graphic artists to further document the experiences of those who were impacted by these events. This work has been generously supported by a grant from the National Endowment for the Arts, specifically their Our Town program, which funds projects that strengthen communities through artistic and creative engagement." key="description" />
        <meta name="twitter:title" content="Rising from the Ashes Artists: The Chimney Tops 2 Wildfires in Memory and Art" key="twitter-title" />
        <meta name="twitter:description" content="Recording the experiences of those who lived through the tragic events of that day and commemorating the heroism and compassion of the community was the objective of Rising from the Ashes, an oral history project of the University of Tennessee Libraries, with support from the city of Gatlinburg and partnership from the Anna Porter Public Library. Drawing inspiration from the interviews recorded by this project, illustrators Paige Braddock, Marshall Ramsey, and Danny Wilson used their skills as graphic artists to further document the experiences of those who were impacted by these events. This work has been generously supported by a grant from the National Endowment for the Arts, specifically their Our Town program, which funds projects that strengthen communities through artistic and creative engagement." key="twitter-summary" />
        <meta name="twitter:image" content="https://digital.lib.utk.edu/iiif/2/collections~islandora~object~rftaart%3A8~datastream~TN/full/max/0/default.jpg" key="twitter-image" />
        <meta name="twitter:image:alt" content="Artwork created by Paige Braddock entitled 'A Family Embarces Their Well-Being" key="twitter-image-alt" />
        <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
        <meta name="twitter:site" content="@utklibraries" key="twitter-site" />
        <meta name="twitter:creator" content="@utklibraries" key="twitter-creator" />
      </Head>
      <section
        style={{
          maxWidth: "calc(100% - 4rem)",
          margin: "1rem auto 0",
          position: "relative",
        }}
      >
        {/* <Filter /> */}
        <Grid>
          {results &&
            results.map((result, i) => {
              return <Grid.Item data={result} key={result.id} />;
            })}
        </Grid>
        <InView
          as="div"
          style={{
            width: "100%",
            height: "50vh",
            position: "absolute",
            bottom: "0",
            left: "0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            zIndex: "0",
          }}
        >
        </InView>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const { loading, error, data } = await client.query({
    query: gql`
      query Manifests {
        manifests(limit: ${RESULT_LIMIT}, offset: 0) {
          id
          label
          slug
          metadata
          collectionId
        }
        Subject: metadata(label: "Subject") {
          manifestId
          label
          value
        }
        Date: metadata(label: "Date") {
          manifestId
          label
          value
        }
      }
    `,
  });

  const { manifests } = data;

  if (!data) return null;

  const METADATA_LABELS = process.env.metadata as any as string[];

  const metadata = METADATA_LABELS.map((string) => {
    const values = data[string];
    return {
      label: string,
      data: lodashMap(lodashGroupBy(values, "value"), (values, value) => ({
        value,
        values,
      })),
    };
  });

  return {
    props: { manifests, metadata },
  };
}
