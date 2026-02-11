import { getPrisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";
import type { UsersRepository } from "../users-repository.js";

//estou usando da vantagem do prisma de já criar os tipos que podem ser passados para criar uma entidade, dessa maneira eu não preciso criar novamente outra interface para indicar quais os dados eu devo passar como parâmetro no método

export class PrismaUsersRepository implements UsersRepository {
  private prisma = getPrisma();

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({
      data,
    });

    return user;
  }
}
