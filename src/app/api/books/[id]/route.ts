import { Prisma } from "@/generated/prisma"
import { getPrismaClient } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const prisma = getPrismaClient()
    const body = await req.json()
    const { title, author, read } = body

    const { id } = await params

    console.log('id1', id)
    const book = await prisma.book.findFirst({ where: { id } })

    console.log('id', id)


    if (!book) {
        return NextResponse.json({ error: `Book with id ${id} not found` }, { status: 404 })
    }

    const updateBook: Prisma.BookCreateInput = {
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