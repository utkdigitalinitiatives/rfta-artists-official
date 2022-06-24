import {useEffect, useState} from "react";
import BloomIIIF from "@samvera/bloom-iiif";
import { StyledArtistDescription, StyledArtist } from "@/components/UTK_Artist/Artist.styled"

const Artist = ({ artist }) => {
  const [baseUrl, setBaseUrl] = useState("");
  useEffect(() => {
    const { host, protocol } = window.location;
    const root = `${protocol}//${host}`;
    setBaseUrl(root);
  }, []);

  return (
    <StyledArtist>
      <h3>{artist.name}</h3>
      <StyledArtistDescription>
        <strong>{artist.name}</strong> {artist.description}
      </StyledArtistDescription>
      <BloomIIIF
        collectionId={artist.collection}
      />
    </StyledArtist>
  );

};

export default Artist;