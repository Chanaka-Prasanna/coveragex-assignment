import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskItem } from "../app/components/TaskItem";

const mockTask = {
  id: "1",
  title: "Item Title",
  description: "Item Desc",
  is_completed: false,
};
const mockToggle = jest.fn();
const mockEdit = jest.fn();
const mockDelete = jest.fn();

describe("TaskItem", () => {
  it("renders task title and description", () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockToggle}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );
    expect(screen.getByText("Item Title")).toBeInTheDocument();
    expect(screen.getByText("Item Desc")).toBeInTheDocument();
  });

  it("calls onToggleComplete when Done button is clicked", () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={mockToggle}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Done/i }));
    expect(mockToggle).toHaveBeenCalledWith("1");
  });
});
