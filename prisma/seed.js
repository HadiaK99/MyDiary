const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: 'file:prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

const ACTIVITY_CATEGORIES = [
  {
    name: "Prayers & Spirituality",
    pointsPerItem: 5,
    activities: [
      "Fajr Prayer", "Zuhr Prayer", "Asr Prayer", "Maghrib Prayer", "Isha Prayer",
      "Quran", "Tasbihaat / Dhikr", "Bismillah", "Salam"
    ]
  },
  {
    name: "Character & Manners",
    pointsPerItem: 3,
    activities: [
      "Truth / Honesty", "Gratitude - Patience", "Speech / Language", "Manners / Behavior", "Kindness / Generosity", "Respect / Politeness"
    ]
  },
  {
    name: "Self-Discipline & Health",
    pointsPerItem: 2,
    activities: [
      "Self Service", "No Wastage (Time, Food, Money)", "Caring for Animals / Plants", "Discipline", "Cleanliness / Hygiene", "Teeth Brush", "Exercise / Physical Games"
    ]
  },
  {
    name: "Daily Habits & Education",
    pointsPerItem: 1,
    activities: [
      "Home Work", "Additional Study", "Sleeping/Awakening Manners", "Breakfast, Lunch, Dinner", "Eating Manners", "TV/Media Limits", "Gadgets Regulations"
    ]
  }
];

async function main() {
  console.log('Cleaning up existing activities...');
  await prisma.activity.deleteMany({});
  await prisma.activityCategory.deleteMany({});

  console.log('Seeding activities...');
  for (const cat of ACTIVITY_CATEGORIES) {
    await prisma.activityCategory.create({
      data: {
        name: cat.name,
        pointsPerItem: cat.pointsPerItem,
        activities: {
          create: cat.activities.map(name => ({ name }))
        }
      }
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
