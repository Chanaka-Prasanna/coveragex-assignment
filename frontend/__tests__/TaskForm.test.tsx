import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { TaskForm } from "../app/components/TaskForm";

const mockOnSubmit = jest.fn(() => Promise.resolve());

beforeEach(() => {
  mockOnSubmit.mockClear();
});

describe("TaskForm", () => {
  it("renders form inputs and button", () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
  });

  it("calls onSubmit when valid form is submitted", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Title/i), {
        target: { value: "Task Title" },
      });
      fireEvent.change(screen.getByLabelText(/Description/i), {
        target: { value: "Task Description" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Add/i }));
    });
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("shows error when submitting empty fields", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Add/i }));
    });
    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows error for too-short title", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Title/i), {
        target: { value: "ab" }, // less than 3
      });
      fireEvent.change(screen.getByLabelText(/Description/i), {
        target: { value: "Valid description" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Add/i }));
    });
    expect(
      screen.getByText(/Title must be at least 3 characters/i)
    ).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows error for too-short description", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Title/i), {
        target: { value: "Valid title" },
      });
      fireEvent.change(screen.getByLabelText(/Description/i), {
        target: { value: "abc" }, // less than 5
      });
      fireEvent.click(screen.getByRole("button", { name: /Add/i }));
    });
    expect(
      screen.getByText(/Description must be at least 5 characters/i)
    ).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("removes error message after correcting input", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    // Submit with empty fields
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Add/i }));
    });
    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    // Correct the title
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Title/i), {
        target: { value: "Valid title" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Add/i }));
    });
    expect(screen.queryByText(/Title is required/i)).toBeNull();
  });

  it("shows error for whitespace-only input", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Title/i), {
        target: { value: "   " },
      });
      fireEvent.change(screen.getByLabelText(/Description/i), {
        target: { value: "   " },
      });
      fireEvent.click(screen.getByRole("button", { name: /Add/i }));
    });
    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("only submits once on rapid clicks", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Title/i), {
        target: { value: "Valid title" },
      });
      fireEvent.change(screen.getByLabelText(/Description/i), {
        target: { value: "Valid description" },
      });
      const button = screen.getByRole("button", { name: /Add/i });
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
    });
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("resets form after successful submit", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Title/i), {
        target: { value: "Valid title" },
      });
      fireEvent.change(screen.getByLabelText(/Description/i), {
        target: { value: "Valid description" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Add/i }));
    });
    expect(screen.getByLabelText(/Title/i)).toHaveValue("");
    expect(screen.getByLabelText(/Description/i)).toHaveValue("");
  });
});
