import React from "react";
import { ChangeEvent } from "react";

const Filter = () => {
  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    // do something with event.target.value
  };

  return <input onChange={(event) => handleSearch(event)} />;
};

export default Filter;
