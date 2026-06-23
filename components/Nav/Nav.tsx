import React from "react";
import { Wrapper } from "@/components/Nav/Nav.styled";
import NavItems from "@/components/Nav/Items";

interface NavItem {
  path: string;
  text: string;
}

interface NavProps {
  items: NavItem[];
}

const Nav = ({ items }: NavProps) => {
  return (
    <Wrapper>
      <NavItems items={items} />
    </Wrapper>
  );
};

export default Nav;
