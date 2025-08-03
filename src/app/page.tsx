"use client"

import { useEffect, useState } from "react"
import { Book, UpdateBookArgs } from "./domain/books"

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
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <h1>List of books</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {isLoading && <div>Loading...</div>}

      {books.map((book, index) => (
        <div key={index}>
          <div>{book.title}</div>
          <div>{book.author}</div>
          <div>
            <label htmlFor="bookRead">Read?</label>
            <input
              id="bookRead"
              type="checkbox"
              checked={book.read ?? false}
              onChange={() => updateBook(book.id, { read: !book.read })}
            />
          </div>
        </div>
      ))}
    </main>
  )
}
