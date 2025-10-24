import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { DeleteTaskModal } from "../app/components/DeleteTaskModal";

const mockTask = {
  id: "1",
  title: "Test Task",
  description: "Test Desc",
  is_completed: false,
};

describe("DeleteTaskModal", () => {
  it("renders when open and displays task title", () => {
    render(
      <DeleteTaskModal
        task={mockTask}
        isOpen={true}
        isDeleting={false}
        onClose={() => {}}
        onConfirm={async () => {}}
      />
    );
    expect(screen.getByText(/Delete Task/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
  });

  it("does not render when not open", () => {
    const { container } = render(
      <DeleteTaskModal
        task={mockTask}
        isOpen={false}
        isDeleting={false}
        onClose={() => {}}
        onConfirm={async () => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
