import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import Page from "../app/page";

describe("Page", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(<Page />);
    });
    // Check for the heading "Add a Task" which is unique
    expect(
      screen.getByRole("heading", { name: "Add a Task" })
    ).toBeInTheDocument();
  });
});
