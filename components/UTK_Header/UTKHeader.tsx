import {useEffect, useState} from "react";
import { UTKUniversalHeader, UTKHeaderTop, UTKLogoWrapper, UTKLogo, UTKHeaderLinks } from "@/components/UTK_Header/UTKHeader.styled"

const UTKHeader = () => {
  const [baseUrl, setBaseUrl] = useState("");
  useEffect(() => {
    const {host, protocol} = window.location;
    const root = `${protocol}//${host}`;
    setBaseUrl(root);
  }, []);

  return (
    <UTKUniversalHeader>
      <UTKHeaderTop>
        <UTKLogoWrapper>
          <UTKLogo>
            <a style={{ margin: "0" }} href="https://utk.edu">
              <img src='/images/utk-logo.png' alt='UTK Logo' />
            </a>
          </UTKLogo>
        </UTKLogoWrapper>
        <a style={{
          alignItems: "center",
          display: "flex",
          color: "#6a6a6a",
          letterSpacing: ".05em",
          fontWeight: "500"
        }} className="libraries-link" href="https://lib.utk.edu">Libraries</a>
      </UTKHeaderTop>
      <UTKHeaderLinks>
      </UTKHeaderLinks>
    </UTKUniversalHeader>
  );
}

export default UTKHeader;
