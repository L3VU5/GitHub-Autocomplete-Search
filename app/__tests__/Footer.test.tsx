import React from "react";
import { render } from "@testing-library/react";
import Footer from "../components/Footer";

test("renders footer with correct attribution", () => {
  const { getByText } = render(<Footer />);
  const footerElement = getByText("By @PawelJedrasik");

  expect(footerElement).toBeInTheDocument();
});
