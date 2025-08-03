import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import CreateBook from "../page"

const mockFetch = jest.fn()
global.fetch = mockFetch

describe("CreateBook", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the create book form", () => {
    render(<CreateBook />)

    expect(screen.getByText("Create Book")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Author")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
  })

  it("shows error when form is submitted with empty fields", async () => {
    render(<CreateBook />)

    const submitButton = screen.getByRole("button", { name: "Submit" })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText("Title and author are required")
      ).toBeInTheDocument()
    })
  })

  it("shows error when only title is provided", async () => {
    render(<CreateBook />)

    const titleInput = screen.getByPlaceholderText("Title")
    const submitButton = screen.getByRole("button", { name: "Submit" })

    fireEvent.change(titleInput, { target: { value: "Test Book" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText("Title and author are required")
      ).toBeInTheDocument()
    })
  })

  it("shows error when only author is provided", async () => {
    render(<CreateBook />)

    const authorInput = screen.getByPlaceholderText("Author")
    const submitButton = screen.getByRole("button", { name: "Submit" })

    fireEvent.change(authorInput, { target: { value: "Test Author" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText("Title and author are required")
      ).toBeInTheDocument()
    })
  })

  it("submits form successfully with valid data", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 201,
      json: async () => ({}),
    } as Response)

    render(<CreateBook />)

    const titleInput = screen.getByPlaceholderText("Title")
    const authorInput = screen.getByPlaceholderText("Author")
    const submitButton = screen.getByRole("button", { name: "Submit" })

    fireEvent.change(titleInput, { target: { value: "Test Book" } })
    fireEvent.change(authorInput, { target: { value: "Test Author" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/books", {
        method: "POST",
        body: JSON.stringify({ title: "Test Book", author: "Test Author" }),
      })
    })
  })

  it("shows loading state during form submission", async () => {
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                status: 201,
                json: async () => ({}),
              } as Response),
            100
          )
        )
    )

    render(<CreateBook />)

    const titleInput = screen.getByPlaceholderText("Title")
    const authorInput = screen.getByPlaceholderText("Author")
    const submitButton = screen.getByRole("button", { name: "Submit" })

    fireEvent.change(titleInput, { target: { value: "Test Book" } })
    fireEvent.change(authorInput, { target: { value: "Test Author" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument()
    })
  })

  it("shows error message when API returns error", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 400,
      json: async () => ({ error: "Book creation failed" }),
    } as Response)

    render(<CreateBook />)

    const titleInput = screen.getByPlaceholderText("Title")
    const authorInput = screen.getByPlaceholderText("Author")
    const submitButton = screen.getByRole("button", { name: "Submit" })

    fireEvent.change(titleInput, { target: { value: "Test Book" } })
    fireEvent.change(authorInput, { target: { value: "Test Author" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Book creation failed")).toBeInTheDocument()
    })
  })

  it("clears error when form is resubmitted with valid data", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 400,
      json: async () => ({ error: "Book creation failed" }),
    } as Response)

    mockFetch.mockResolvedValueOnce({
      status: 201,
      json: async () => ({}),
    } as Response)

    render(<CreateBook />)

    const titleInput = screen.getByPlaceholderText("Title")
    const authorInput = screen.getByPlaceholderText("Author")
    const submitButton = screen.getByRole("button", { name: "Submit" })

    // Submit to get error
    fireEvent.change(titleInput, { target: { value: "Test Book" } })
    fireEvent.change(authorInput, { target: { value: "Test Author" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Book creation failed")).toBeInTheDocument()
    })

    // Submit again
    fireEvent.click(submitButton)

    await waitFor(
      () => {
        expect(
          screen.queryByText("Book creation failed")
        ).not.toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it("prevents form submission when loading", async () => {
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                status: 201,
                json: async () => ({}),
              } as Response),
            200
          )
        )
    )

    render(<CreateBook />)

    const titleInput = screen.getByPlaceholderText("Title")
    const authorInput = screen.getByPlaceholderText("Author")
    const submitButton = screen.getByRole("button", { name: "Submit" })

    fireEvent.change(titleInput, { target: { value: "Test Book" } })
    fireEvent.change(authorInput, { target: { value: "Test Author" } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })
})
