import { Wrapper, Funding } from "@/components/Footer/Footer.styled";

const Footer = () => {
  return (
    <Wrapper>
      <Funding>
        <p>This project was made possible in part by the <a href="https://www.arts.gov/">National Endowment for the Arts</a> grant 1863142-42-20.</p>
        <a href="https://www.arts.gov/">
          <img src="/images/nea.jpg" alt="National Endowment for the Arts" />
        </a>
      </Funding>
    </Wrapper>
  );
};

export default Footer;
