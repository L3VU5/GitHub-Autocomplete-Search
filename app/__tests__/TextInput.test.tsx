import React from "react";
import { render } from "@testing-library/react";
import TextInput from "../components/TextInput";

test("renders TextInput component", () => {
  const handleChange = jest.fn();
  const { getByDisplayValue } = render(
    <TextInput value="Test value" onChange={handleChange} />
  );
  const input = getByDisplayValue("Test value");

  expect(input).toBeInTheDocument();
});
