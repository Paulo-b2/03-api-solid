import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { CheckInUseCase } from "./check-in.js";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { Decimal } from "@prisma/client/runtime/index-browser";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error.js";
import { MaxDistanceError } from "./errors/max-distance-error.js";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -15.9537472,
      longitude: -44.8561152,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "id-01",
      userLatitude: -15.9537472,
      userLongitude: -44.8561152,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "id-01",
      userLatitude: -15.9537472,
      userLongitude: -44.8561152,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "id-01",
        userLatitude: -15.9537472,
        userLongitude: -44.8561152,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "id-01",
      userLatitude: -15.9537472,
      userLongitude: -44.8561152,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "id-01",
      userLatitude: -15.9537472,
      userLongitude: -44.8561152,
    });

    expect(checkIn.user_id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-15.8538838),
      longitude: new Decimal(-44.7446375),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "id-01",
        userLatitude: -15.9537472,
        userLongitude: -44.8561152,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
