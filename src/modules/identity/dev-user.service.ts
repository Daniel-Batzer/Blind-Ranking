import type { User } from "@/generated/prisma/client";
import { findUserByExternalAccount } from "./user.repository";

export async function getDevUser(): Promise<User> {
  const user = await findUserByExternalAccount("test", "dev-creator");

  if (user === null) {
    throw new Error(
      "Dev user not found. Please run the seed script to create the dev user.",
    );
  }

  return user;
}
