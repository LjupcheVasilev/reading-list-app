import { CreateBookArgs } from "@/domain/books"
import { getPrismaClient } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const prisma = getPrismaClient()
    const body = await req.json()
    const { id } = await params
    const { title, author, read } = body

    if (title === "" || author === "") {
        return NextResponse.json({ error: "Title and author are required." }, { status: 400 })
    }

    const book = await prisma.book.findFirst({ where: { id } })

    if (!book) {
        return NextResponse.json({ error: `Book with id ${id} not found` }, { status: 404 })
    }

    const updateBook: CreateBookArgs = {
        title: title ?? book.title,
        author: author ?? book.author,
        read: read !== undefined ? read : book.read
    }

    const updatedBook = await prisma.book.update({
        data: updateBook,
        where: {
            id
        }
    })

    return NextResponse.json(updatedBook)
}