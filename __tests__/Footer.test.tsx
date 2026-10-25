import { render, screen } from "@testing-library/react";
import Footer from "../app/components/Footer";

test("links to the author and the source", () => {
  render(<Footer />);

  expect(screen.getByRole("link", { name: /paweł jędrasik/i })).toHaveAttribute(
    "href",
    "https://github.com/L3VU5"
  );
  expect(screen.getByRole("link", { name: /view source/i })).toHaveAttribute(
    "href",
    "https://github.com/L3VU5/GitHub-Autocomplete-Search"
  );
});
