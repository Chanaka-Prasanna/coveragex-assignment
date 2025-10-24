import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditTaskModal } from "../app/components/EditTaskModal";

const mockTask = {
  id: "1",
  title: "Edit Me",
  description: "Edit Desc",
  is_completed: false,
};

describe("EditTaskModal", () => {
  it("renders when open and displays initial values", () => {
    render(
      <EditTaskModal
        task={mockTask}
        isOpen={true}
        isSaving={false}
        onClose={() => {}}
        onSave={async () => {}}
      />
    );
    // Check heading
    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    // Check labels
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    // Check input values
    expect(screen.getByDisplayValue(mockTask.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTask.description)).toBeInTheDocument();
  });

  it("does not render when not open", () => {
    const { container } = render(
      <EditTaskModal
        task={mockTask}
        isOpen={false}
        isSaving={false}
        onClose={() => {}}
        onSave={async () => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
