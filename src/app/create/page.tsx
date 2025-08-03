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
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">
          Add New Book
        </h1>

        {error && (
          <div className="border border-red-200 text-red-400 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={createBook} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Book Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter book title"
              ref={titleRef}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              placeholder="Enter author name"
              ref={authorRef}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding Book...
              </div>
            ) : (
              "Add Book"
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
