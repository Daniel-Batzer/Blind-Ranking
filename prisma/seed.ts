import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.externalAccount.upsert({
    where: {
      provider_providerAccountId: {
        provider: "test",
        providerAccountId: "dev-creator",
      },
    },
    update: {},
    create: {
      provider: "test",
      providerAccountId: "dev-creator",
      user: {
        create: {
          displayName: "Dev Creator",
          canHostGames: true,
        },
      },
    },
  });

  console.log("Created dev creator:");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
