import type { Prisma, CheckIn } from "@prisma/client";
import type { CheckInsRepository } from "../check-ins-repository.js";
import { getPrisma } from "@/lib/prisma.js";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
  private prisma = getPrisma();

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await this.prisma.checkIn.create({
      data,
    });

    return checkIn;
  }

  async save(data: CheckIn) {
    const checkIn = await this.prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    });

    return checkIn;
  }

  async findById(id: string) {
    const checkIn = await this.prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkIn = await this.prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await this.prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkIns;
  }

  async countByUserId(userId: string) {
    const count = await this.prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });

    return count;
  }
}
