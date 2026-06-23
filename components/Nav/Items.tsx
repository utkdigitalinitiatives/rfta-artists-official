import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Highlight, Items } from "@/components/Nav/Nav.styled";

interface NavItem {
  path: string;
  text: string;
}

interface NavItemsProps {
  items: NavItem[];
}

const NavItems = ({ items }: NavItemsProps) => {
  const [itemBoundingBox, setItemBoundingBox] = React.useState<DOMRect | null>(null);
  const [wrapperBoundingBox, setWrapperBoundingBox] = React.useState<DOMRect | null>(null);
  const [highlightedItem, setHighlightedItem] = React.useState<NavItem | null>(null);
  const [isHoveredFromNull, setIsHoveredFromNull] = React.useState(true);

  const highlightRef = React.useRef(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const repositionHighlight = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    setItemBoundingBox((e.target as HTMLAnchorElement).getBoundingClientRect());
    setWrapperBoundingBox(wrapperRef.current?.getBoundingClientRect() || null);
    setIsHoveredFromNull(!highlightedItem);
    setHighlightedItem(item);
  };

  const resetHighlight = () => setHighlightedItem(null);

  let highlightStyles = {};

  if (itemBoundingBox && wrapperBoundingBox) {
    highlightStyles = {
      transitionDuration: isHoveredFromNull ? "0ms" : "100ms",
      opacity: highlightedItem ? 0.25 : 0,
      width: `${itemBoundingBox.width}px`,
      transform: `translate(${
        itemBoundingBox.left - wrapperBoundingBox.left
      }px)`,
    };
  }

  const router = useRouter();

  return (
    <Items ref={wrapperRef} onMouseLeave={resetHighlight}>
      <Highlight ref={highlightRef} css={highlightStyles} />
      {items.map((item) => (
        <Link href={item.path} key={item.path}>
          <a
            className={router.pathname == item.path ? "active" : ""}
            onMouseOver={(ev) => repositionHighlight(ev, item)}
          >
            {item.text}
          </a>
        </Link>
      ))}
    </Items>
  );
};

export default NavItems;
