import { Prisma } from "@/generated/prisma"

export type Book = Prisma.BookGetPayload<null>
export type CreateBookArgs = Prisma.BookCreateInput
export type UpdateBookArgs = Prisma.BookUpdateInput