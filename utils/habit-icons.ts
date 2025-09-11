// Habit Icons Configuration
// Easy to extend - just add new objects to the array!

const HABIT_ICONS = [
    // Prayer & Spiritual
    { id: "prayer_icon", emoji: "🕌", name: "Prayer", color: "green" },
    { id: "quran_icon", emoji: "📖", name: "Quran", color: "green" },
    { id: "tasbih_icon", emoji: "📿", name: "Tasbih", color: "purple" },
    
    // Physical Health
    { id: "exercise_icon", emoji: "💪", name: "Exercise", color: "red" },
    { id: "workout_icon", emoji: "🏋️‍♂️", name: "Workout", color: "red" },
    { id: "run_icon", emoji: "🏃‍♂️", name: "Run", color: "green" },
    { id: "stretching_icon", emoji: "🤸‍♂️", name: "Stretching", color: "green" },
    { id: "water_icon", emoji: "💧", name: "Water", color: "blue" },
    
    // Restrictions & No-Go
    { id: "no_phone_icon", emoji: "📵", name: "No Phone", color: "red" },
    
    // Learning & Development
    { id: "book_icon", emoji: "📚", name: "Reading", color: "blue" },
    { id: "headphones_icon", emoji: "🎧", name: "Audio", color: "purple" },
    { id: "writing_icon", emoji: "📝", name: "Writing", color: "green" },
    
    // Mindfulness & Wellness
    { id: "sleep_icon", emoji: "😴", name: "Sleep", color: "blue" },
    { id: "meditation_icon", emoji: "🧘‍♀️", name: "Meditation", color: "purple" },
    { id: "gratitude_icon", emoji: "🙏", name: "Gratitude", color: "yellow" },
    
    // Time & Schedule
    { id: "sunrise_icon", emoji: "🌅", name: "Morning", color: "orange" },
    { id: "sun_icon", emoji: "☀️", name: "Day Time", color: "yellow" },
    { id: "moon_icon", emoji: "🌙", name: "Night Time", color: "indigo" },
];

const COLOR_MAP = {
    green: { card: "bg-card-green", text: "text-habit-green" },
    purple: { card: "bg-card-purple", text: "text-habit-purple" },
    blue: { card: "bg-card-blue", text: "text-habit-blue" },
    yellow: { card: "bg-card-yellow", text: "text-habit-yellow" },
    red: { card: "bg-card-red", text: "text-habit-red" },
    orange: { card: "bg-card-orange", text: "text-habit-orange" },
    indigo: { card: "bg-card-indigo", text: "text-habit-indigo" },
    brown: { card: "bg-card-brown", text: "text-habit-brown" },
    pink: { card: "bg-card-pink", text: "text-habit-pink" },
    default: { card: "bg-card-green", text: "text-habit-green" },
};

const getHabitIcon = (iconName: string) => {
    const icon = HABIT_ICONS.find(i => i.id === iconName);
    return icon?.emoji || "✅";
};

const getHabitCardColor = (iconName: string) => {
    const icon = HABIT_ICONS.find(i => i.id === iconName);
    const color = icon?.color || "default";
    return COLOR_MAP[color as keyof typeof COLOR_MAP]?.card || COLOR_MAP.default.card;
};

const getHabitTextColor = (iconName: string) => {
    const icon = HABIT_ICONS.find(i => i.id === iconName);
    const color = icon?.color || "default";
    return COLOR_MAP[color as keyof typeof COLOR_MAP]?.text || COLOR_MAP.default.text;
};

const getHabitName = (iconName: string) => {
    const icon = HABIT_ICONS.find(i => i.id === iconName);
    return icon?.name || "Habit";
};

const AVAILABLE_ICONS = HABIT_ICONS;

const HABIT_CARD_COLORS = Object.fromEntries(
    HABIT_ICONS.map(icon => [icon.id, getHabitCardColor(icon.id)])
);

const HABIT_TEXT_COLORS = Object.fromEntries(
    HABIT_ICONS.map(icon => [icon.id, getHabitTextColor(icon.id)])
);

export {
    HABIT_ICONS,
    AVAILABLE_ICONS,
    HABIT_CARD_COLORS,
    HABIT_TEXT_COLORS,
    getHabitIcon,
    getHabitCardColor,
    getHabitTextColor,
    getHabitName,
}
