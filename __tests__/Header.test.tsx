import { render, screen } from "@testing-library/react";
import Header from "../app/components/Header";

test("renders the page heading", () => {
  render(<Header />);

  expect(
    screen.getByRole("heading", { level: 1, name: /search github users and repositories/i })
  ).toBeInTheDocument();
});
