import { prisma } from "@/lib/prisma";

type ClerkIdentity = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  primaryEmailAddressId: string | null;
  emailAddresses: Array<{ id: string; emailAddress: string }>;
};

/**
 * Map a Clerk identity to our MongoDB User.
 * Never trusts client-provided owner IDs.
 */
export async function findOrCreateUserFromClerk(clerkUser: ClerkIdentity) {
  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  const email =
    clerkUser.emailAddresses.find(
      (item) => item.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    null;

  const displayName =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
    clerkUser.username ||
    null;

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        email: email ?? existing.email,
        displayName: displayName ?? existing.displayName,
      },
    });
  }

  return prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email,
      displayName,
    },
  });
}
