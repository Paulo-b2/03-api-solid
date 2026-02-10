import type { Gym, Prisma } from "@prisma/client";
import type {
  FindManyNearbyParams,
  GymsRepository,
} from "../gyms-repository.js";
import { getPrisma } from "@/lib/prisma.js";

export class PrismaGymsRepository implements GymsRepository {
  private prisma = getPrisma();

  async findById(id: string) {
    const gym = await this.prisma.gym.findUnique({
      where: {
        id,
      },
    });

    return gym;
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await this.prisma.$queryRaw<Gym[]>`
        SELECT * FROM gyms
        WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos ( radians( latitude )) * cos ( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude})) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }

  async searchMany(query: string, page: number) {
    const gyms = await this.prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return gyms;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await this.prisma.gym.create({
      data,
    });

    return gym;
  }
}
