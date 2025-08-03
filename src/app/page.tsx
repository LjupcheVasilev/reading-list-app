"use client"

import { useEffect, useState } from "react"
import { Book, UpdateBookArgs } from "../domain/books"

export default function Home() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [books, setBooks] = useState<Book[]>([])

  const fetchBooks = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/books")
      const responseBody: Book[] | { error: string } = await response.json()

      if ("error" in responseBody) {
        const { error } = responseBody

        console.error(error)
        setError(error)
      } else {
        setBooks(responseBody)
      }
    } catch (error) {
      console.error(error)
      setError(error as string)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const updateBook = async (id: string, update: UpdateBookArgs) => {
    const response = await fetch(`/api/books/${id}`, {
      method: "POST",
      body: JSON.stringify({ read: update.read ?? false }),
    })

    const responseBody = await response.json()

    if ("error" in responseBody) {
      const { error } = responseBody

      console.error(error)
      setError(error)
    } else {
      const updatedBooks = books.reduce((acc: Book[], book: Book) => {
        if (book.id === responseBody.id) {
          acc.push(responseBody)
        } else {
          acc.push(book)
        }

        return acc
      }, [])

      setBooks(updatedBooks)
    }
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">
          My Reading List
        </h1>

        {error && (
          <div className="border border-red-200 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-100">Loading books...</p>
          </div>
        )}

        {!isLoading && books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-100 text-lg">
              No books in your reading list yet.
            </p>
            <p className="text-gray-400 mt-2">Add some books to get started!</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book, index) => (
            <div
              key={index}
              className="rounded-lg shadow-sm border border-gray-500 p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-gray-200 text-sm">by {book.author}</p>
              </div>

              <div className="flex items-center justify-between">
                <label
                  htmlFor={`bookRead-${book.id}`}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    id={`bookRead-${book.id}`}
                    type="checkbox"
                    checked={book.read ?? false}
                    onChange={() => updateBook(book.id, { read: !book.read })}
                    className="w-4 h-4 text-blue-600 bg border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-200">
                    {book.read ? "Read" : "Not read"}
                  </span>
                </label>

                <div
                  className={`px-2 py-1 ml-4 rounded-full text-xs font-medium ${
                    book.read
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {book.read ? "Completed" : "In Progress"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
