export interface ActivityCategory {
  name: string;
  activities: string[];
  pointsPerItem: number;
}

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    name: "Prayers & Spirituality",
    pointsPerItem: 5,
    activities: [
      "Fajr Prayer",
      "Zuhr Prayer",
      "Asr Prayer",
      "Maghrib Prayer",
      "Isha Prayer",
      "Quran (Quantity)",
      "Durood Pak (Numbers)",
      "Bismillah (Doing every thing)",
      "Salam/Meeting (Leaving, Entering)"
    ]
  },
  {
    name: "Character & Manners",
    pointsPerItem: 3,
    activities: [
      "Truth / Honesty",
      "Gratitude - Patience",
      "Obedience",
      "Speech / Language",
      "Manners / Behavior",
      "Human Rights / Kindness"
    ]
  },
  {
    name: "Self-Discipline & Health",
    pointsPerItem: 2,
    activities: [
      "Self Service",
      "Help / Service",
      "Not Wasting (Time, Food, Money)",
      "Animals / Plants Caring",
      "Management / Discipline",
      "Cleanliness (Body, Cloth, Room)",
      "Teeth Brush (Morning, Night)",
      "Exercise / Physical Games"
    ]
  },
  {
    name: "Daily Habits & Education",
    pointsPerItem: 1,
    activities: [
      "Home Work",
      "Additional Study",
      "Sleeping/Awakening Manners",
      "Breakfast, Lunch, Dinner",
      "Eating Manners",
      "TV/Media Limits",
      "Gadgets Regulations"
    ]
  }
];

export const GOOD_THINGS = [
  "Sadqa", "Care of Patient", "Learning Surah/Dua", "Islamic Constructive Reading", 
  "Audio / Video Sharing", "Teaching", "Learning Good Things", "Fasting", 
  "Forgiveness", "Hospitality", "Gathering Manners"
];

export const BAD_THINGS = [
  "Abuse", "Back Biting", "Fear", "Horror/Magic Stories", "Jealousy", 
  "Bad Spendings", "Theft", "Stubborn"
];

export const POINTS = {
  HABIT: 1, // Standard habit check
  GOOD_THING: 10,
  BAD_THING: -15
};

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
