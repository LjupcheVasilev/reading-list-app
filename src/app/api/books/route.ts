import { Prisma } from "@/generated/prisma"
import { getPrismaClient } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const prisma = getPrismaClient()
    const body = await req.json()
    const { title, author } = body

    if (!title || !author) {
        return NextResponse.json({ error: 'Title and author are required' }, { status: 400 })
    }

    const createBook: Prisma.BookCreateInput = {
        title,
        author,
    }

    const book = await prisma.book.create({
        data: createBook
    })

    return NextResponse.json(book, { status: 201 })
}