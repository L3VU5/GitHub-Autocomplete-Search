import React from "react";
import { render } from "@testing-library/react";
import Header from "../components/Header";

test("renders header with correct text", () => {
  const { getByText } = render(<Header />);
  const headerElement = getByText("Search GitHub Users and Repositories");

  expect(headerElement).toBeInTheDocument();
});
