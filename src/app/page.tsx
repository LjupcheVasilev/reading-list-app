"use client"

import { Prisma } from "@/generated/prisma"
import { useEffect, useState } from "react"

export default function Home() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [books, setBooks] = useState<Prisma.BookSelect[]>([])

  const fetchBooks = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/books")
      const responseBody = await response.json()

      if (response.status !== 200) {
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
            <input id="bookRead" type="checkbox" checked={book.read ?? false} />
          </div>
        </div>
      ))}
    </main>
  )
}
