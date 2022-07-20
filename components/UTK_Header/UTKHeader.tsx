import {useEffect, useState} from "react";
import { UTKUniversalHeader, UTKHeaderTop, UTKLogoWrapper, UTKLogo, UTKHeaderLinks } from "@/components/UTK_Header/UTKHeader.styled"
import Image from "next/image";
import utk_logo from "../../public/images/utk-logo.png";

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
              <Image
                src={utk_logo}
                width="444"
                height="115"
                priority
                />
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
