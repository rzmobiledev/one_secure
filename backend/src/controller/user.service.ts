import { PrismaClient, Prisma  } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'


export class UserService {
    private prisma = new PrismaClient()
    .$extends(withAccelerate())

    public async getUserById(email: string) {
        const user = this.prisma.user.findUnique({
            where: { email },
            omit: {
                password: false,
            }
        });

        return user || null;
    }
}