export function isSignedIn({ session }) {
  return Boolean(session);
}

// Permissions är funktioner för att kontrollera om den nuvarande användarens roll värde satt till true.
export const permissions = {
  canCreateItems: ({ session }) => session?.data.role?.canCreateItems ?? false,
  canManageAllItems: ({ session }) => session?.data.role?.canManageAllItems ?? false,
  canManageUsers: ({ session }) => session?.data.role?.canManageUsers ?? false,
  canManageRoles: ({ session }) => session?.data.role?.canManageRoles ?? false,
};

// Rules är funktioner som returnerar true, false eller filter som begränsar datan.
export const rules = {
  canReadItems: ({ session }) => {
    if (!session) return true;

    if (session.data.role?.canManageAllItems) {
      return true;
    }

    // Gör så en användare bara kan se sina egna items.
    return { author: { id: { equals: session.itemId } } };
  },
  canManageItems: ({ session }) => {
    if (!session) return false;

    // Om användare har canMangaAllItems
    if (session.data.role?.canManageAllItems) return true;

    // Annars så kan man bara redigera sina egna.
    return { author: { id: { equals: session.itemId } } };
  },
  canReadUsers: ({ session }) => {
    if (!session) return false;

    if (session.data.role?.canSeeOtherUsers) return true;

    return { id: { equals: session.itemId } };
  },
  canUpdateUsers: ({ session }) => {
    if (!session) return false;

    if (session.data.role?.canEditOtherUsers) return true;

    return { id: { equals: session.itemId } };
  },
};
