import { prisma } from "@/lib/prisma";

export async function findUserByExternalAccount(
  provider: string,
  providerAccountId: string,
) {
  const account = await prisma.externalAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    include: {
      user: true,
    },
  });

  return account?.user ?? null;
}
