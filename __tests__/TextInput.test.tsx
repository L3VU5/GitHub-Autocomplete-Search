import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextInput from "../app/components/TextInput";

test("shows the value", () => {
  render(<TextInput value="Test value" onChange={() => {}} />);

  expect(screen.getByDisplayValue("Test value")).toBeInTheDocument();
});

test("offers a clear button only when there is a value", async () => {
  const onClear = jest.fn();
  const { rerender } = render(<TextInput value="" onChange={() => {}} onClear={onClear} />);
  expect(screen.queryByRole("button", { name: /clear search/i })).not.toBeInTheDocument();

  rerender(<TextInput value="react" onChange={() => {}} onClear={onClear} />);
  await userEvent.click(screen.getByRole("button", { name: /clear search/i }));
  expect(onClear).toHaveBeenCalledTimes(1);
});
