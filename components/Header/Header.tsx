import Link from "next/link";
import Nav from "@/components/Nav/Nav";
import { Title, Subtitle, Wrapper, TitleWrapper } from "@/components/Header/Header.styled";
import IIIF from "@/components/SVG/IIIF";

const title = process.env.title;
const subtitle = process.env.subtitle;
const collection = process.env.collection;

const navItems = [
  { path: "/", text: "Browse Art" },
  { path: "/artists", text: "About"},
];

const Header = () => {
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>
          <Link href="/">
            <a>{title}</a>
          </Link>
        </Title>
        <Subtitle>
          <Link href="/">
            <a>{subtitle}</a>
          </Link>
        </Subtitle>
      </TitleWrapper>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Nav items={navItems} />
        <a
          href={collection}
          target="_blank"
          style={{
            width: "1rem",
            height: "1rem",
            display: "inline-flex",
          }}
        >
          <IIIF blue="#fff" red="#fff" />
        </a>
      </div>
    </Wrapper>
  );
};

export default Header;
