import { gql } from "@apollo/client";
import { client } from "@/pages/api/graphql";
import Layout from "@/components/layout";
import Viewer from "@/components/Viewer/Viewer";
import { Vault } from "@iiif/vault";
import Metatag from "@/components/Metatag/Metatag";
import { Summary, Thumbnail } from "@samvera/nectar-iiif";
import Related from "@/components/Related/Related";
import WorkInner from "@/components/Work/Inner";
import CANOPY_MANIFESTS from "@/.canopy/manifests.json";

type CanopyManifest = {
  id: string;
  slug: string;
};

export default function Manifest({ manifest, slug }: { manifest: any; slug: string }) {
  const { id, label, metadata, summary, thumbnail } = manifest;
  const artist = metadata.filter(function (x: any) {
    if (x.label.en[0] == "Artist") {
      return x.value.en[0];
    }
  })[0].value.en[0];

  return (
    <Layout>
      <Metatag label={label} summary={summary} thumbnail={thumbnail} />
      <div style={{ padding: "1.31rem 0 0" }}>
        <Viewer manifestId={`/api/iiif/manifest/${slug}`} />
      </div>
      <WorkInner manifest={manifest} />
      <Related label={label} artist={artist} />
    </Layout>
  );
}

export async function getStaticProps({ params }: { params: any }) {
  const { slug } = params;

  const index = (CANOPY_MANIFESTS as CanopyManifest[]).find(
    (item) => item.slug === slug,
  );

  if (!index) {
    return {
      notFound: true,
      revalidate: 600,
    };
  }

  const vault = new Vault();
  const manifest = await vault
    .loadManifest(index.id)
    .then((data) => data)
    .catch((error) => {
      console.error(`Manifest ${index.id} failed to load: ${error}`);
    });

  if (!manifest) {
    return {
      notFound: true,
      revalidate: 600,
    };
  }

  return {
    props: { manifest, slug },
    revalidate: 600,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
