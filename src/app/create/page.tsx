"use client"
import { useRef, useState } from "react"

export default function CreateBook() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const titleRef = useRef<HTMLInputElement>(null)
  const authorRef = useRef<HTMLInputElement>(null)

  const createBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError("")

    const title = titleRef.current?.value
    const author = authorRef.current?.value

    if (!title || !author) {
      setError("Title and author are required")
      return
    }

    setIsLoading(true)
    const response = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify({ title, author }),
    })

    if (response.status !== 201) {
      const responseBody = await response.json()
      const { error } = responseBody
      console.error(error)
      setError(error)
    }

    setIsLoading(false)
  }

  return (
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <h1>Create Book</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={createBook}>
        <input type="text" name="title" placeholder="Title" ref={titleRef} />
        <input type="text" name="author" placeholder="Author" ref={authorRef} />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </main>
  )
}
