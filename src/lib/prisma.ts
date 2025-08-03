import { PrismaClient } from '../generated/prisma'

let client: PrismaClient | null = null
export const getPrismaClient = () => {

    if (!client) {
        client = new PrismaClient()
    }

    return client
}