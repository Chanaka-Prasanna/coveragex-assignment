import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { TaskList } from "../app/components/TaskList";

const mockTasks = [
  { id: "1", title: "Task 1", description: "Desc 1", is_completed: false },
  { id: "2", title: "Task 2", description: "Desc 2", is_completed: true },
];
const mockToggle = jest.fn();
const mockEdit = jest.fn();
const mockDelete = jest.fn();

describe("TaskList", () => {
  it("renders loading spinner when isLoading", () => {
    render(
      <TaskList
        tasks={mockTasks}
        isLoading={true}
        onToggleComplete={mockToggle}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );
    // Check for the loading spinner by aria-busy attribute
    const spinnerContainer = screen.getByTestId("loading-spinner");
    expect(spinnerContainer).toBeInTheDocument();
    expect(spinnerContainer).toHaveAttribute("aria-busy", "true");
  });

  it("renders no tasks message when empty", () => {
    render(
      <TaskList
        tasks={[]}
        isLoading={false}
        onToggleComplete={mockToggle}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );
    expect(screen.getByText(/No tasks to display/i)).toBeInTheDocument();
  });

  it("renders tasks when not loading", () => {
    render(
      <TaskList
        tasks={mockTasks}
        isLoading={false}
        onToggleComplete={mockToggle}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });
});
