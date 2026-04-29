import prisma from "./backend/lib/prisma";

async function main() {
  const categories = await prisma.activityCategory.findMany({
    include: { activities: true }
  });
  console.log(JSON.stringify(categories, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
