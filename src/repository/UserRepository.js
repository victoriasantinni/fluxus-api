import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function findByEmail(email) {
    const user = await prisma.user.findUnique({ 
        where: { 
            email: email 
        }
    });
    
    return user; 
}

export async function existsByEmail(email) {
    const count = await prisma.user.count({
        where: { 
            email: email 
        }
    });
    
    return count > 0;
}

export async function save(userData) {
    const newUser = await prisma.user.create({
        data: userData
    });
    return newUser;
}