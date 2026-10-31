import fs from "node:fs";
import path from "node:path";

const memes = [
  {
    id: "meme_phone",
    title: "УБЕРИ ТЕЛЕФОН!",
    quote: "Я тебе говорю, убери телефон!",
    theme: "#ef4444",
    bg: "#180606",
    symbol: "📱❌",
    sub: "Краснодарская маршрутка 2026",
    tags: ["гнев", "камера", "маршрутка", "агрессия"],
  },
  {
    id: "meme_air",
    title: "ВОЗДУХАН",
    quote: "Чистый воздух гоняет, турбину включил",
    theme: "#38bdf8",
    bg: "#041520",
    symbol: "🌪️",
    sub: "Промышленный вентилятор брейнрота",
    tags: ["балабол", "пустослов", "ветер", "обещания"],
  },
  {
    id: "meme_67",
    title: "67 (СИКС-СЕВЕН)",
    quote: "Главный хук зумеров осени 2026",
    theme: "#eab308",
    bg: "#1c1602",
    symbol: "6️⃣7️⃣",
    sub: "В паспорте вместо подписи",
    tags: ["число", "тренд", "тикток", "зумеры"],
  },
  {
    id: "meme_chigur",
    title: "АНТОН ЧАГУР",
    quote: "Какой самый большой куш ты выигрывал?",
    theme: "#a855f7",
    bg: "#13071f",
    symbol: "🪙",
    sub: "Орёл или решка. Каре и баллон",
    tags: ["монета", "психопат", "судьба", "каре"],
  },
  {
    id: "meme_telifon",
    title: "ТЕЛИФОН",
    quote: "Алло! Это телифон?!",
    theme: "#10b981",
    bg: "#03170e",
    symbol: "☎️",
    sub: "Абсурдное произношение 2026",
    tags: ["звонок", "дед", "связь", "алло"],
  },
  {
    id: "meme_brdysh",
    title: "БРДЫЩ",
    quote: "Закон СССР о полном запрете голода",
    theme: "#f97316",
    bg: "#1d0c03",
    symbol: "🐟🐕",
    sub: "Советский брейнрот. Рыба-собака",
    tags: ["ссср", "абсурд", "архив", "брдыщ"],
  },
  {
    id: "meme_cheremsha",
    title: "ТИХО, ЧЕРЕМША",
    quote: "Не спеша, в тишине осенней...",
    theme: "#84cc16",
    bg: "#101902",
    symbol: "🌿",
    sub: "Нейро-ностальгия и постирония",
    tags: ["уют", "осень", "ностальгия", "вайб"],
  },
  {
    id: "meme_rave",
    title: "ИТАЛЬЯНСКИЙ РЕЙВ",
    quote: "Бомбардиро Крокодило на хардбасе",
    theme: "#ec4899",
    bg: "#1f0312",
    symbol: "🐊🎧",
    sub: "Tung Tung Tung Sahur 200 BPM",
    tags: ["рейв", "бас", "крокодил", "клуб"],
  },
  {
    id: "meme_maga",
    title: "МАГА, СИЯЙ!",
    quote: "Лезгинка под фонк под лучом с неба",
    theme: "#facc15",
    bg: "#1e1800",
    symbol: "✨🕺",
    sub: "Символ внезапного озарения",
    tags: ["свет", "успех", "танец", "озарение"],
  },
  {
    id: "meme_bobr",
    title: "СИДИМ С БОБРОМ",
    quote: "Вдвоём на ужин готовим полено",
    theme: "#b45309",
    bg: "#1f0e02",
    symbol: "🦫🪵",
    sub: "Курва бобр и Слава Скрипка",
    tags: ["бобр", "ужин", "полено", "курва"],
  },
  {
    id: "meme_42",
    title: "42 БРАТУХИ!",
    quote: "Э-э-эу! Четыре пальца вверх",
    theme: "#6366f1",
    bg: "#0a0a24",
    symbol: "✌️✌️",
    sub: "Стримерский жест и кодекс",
    tags: ["братуха", "пальцы", "стрим", "клич"],
  },
  {
    id: "meme_chill",
    title: "CHILL GUY",
    quote: "Я просто чилл гай, мне всё равно",
    theme: "#d97706",
    bg: "#1e1003",
    symbol: "🐕🧥",
    sub: "Пёс в коричневом свитере",
    tags: ["пофигизм", "спокойствие", "свитер", "чилл"],
  },
  {
    id: "meme_quadro",
    title: "КВАДРОБЕРЫ",
    quote: "Бабушка выгуливает котика в парке",
    theme: "#06b6d4",
    bg: "#02151a",
    symbol: "🐱🐾",
    sub: "В масках животных на четвереньках",
    tags: ["котик", "поводок", "парк", "зумеры"],
  },
  {
    id: "meme_okak",
    title: "ОКАК",
    quote: "Оцепенение и полное принятие",
    theme: "#64748b",
    bg: "#0d131a",
    symbol: "🐱👀",
    sub: "Взгляд в бездну",
    tags: ["шок", "принятие", "кот", "тишина"],
  },
  {
    id: "meme_zolotko",
    title: "ИВАН ЗОЛО",
    quote: "Я баобаб, стою в лесу один",
    theme: "#14b8a6",
    bg: "#021715",
    symbol: "🌳",
    sub: "Бессменный мамонт Тиктока",
    tags: ["баобаб", "тикток", "золо", "рэп"],
  },
  {
    id: "meme_dikec",
    title: "ЮСУФ ДИКЕЧ",
    quote: "Без очков, без наушников, рука в кармане",
    theme: "#94a3b8",
    bg: "#0f172a",
    symbol: "🎯",
    sub: "Турецкий стрелок на абсолютном чилле",
    tags: ["стрелок", "олимпиада", "хладнокровие", "карман"],
  },
  {
    id: "meme_dubai",
    title: "ДУБАЙСКИЙ ШОКОЛАД",
    quote: "Хруст катаифи и ядовитая фисташка",
    theme: "#22c55e",
    bg: "#051f0c",
    symbol: "🍫",
    sub: "Главный гастрономический психоз",
    tags: ["хруст", "шоколад", "фисташка", "тренд"],
  },
  {
    id: "meme_skuf",
    title: "СКУФ И АЛЬТУШКА",
    quote: "Одобрено на портале Госуслуг",
    theme: "#78716c",
    bg: "#171412",
    symbol: "🍺🎮",
    sub: "Танки, диван и вечная любовь",
    tags: ["скуф", "альтушка", "госуслуги", "танки"],
  },
  {
    id: "meme_hamster",
    title: "ТАПАЙ ХОМЯКА",
    quote: "Мозоли на пальцах ради листинга",
    theme: "#f59e0b",
    bg: "#1c1202",
    symbol: "🐹🪙",
    sub: "Hamster Kombat",
    tags: ["хомяк", "крипта", "кликер", "миллионы"],
  },
  {
    id: "meme_plaki",
    title: "ПЛАКИ-ПЛАКИ",
    quote: "Плаки-плаки или нормалдаки?",
    theme: "#f43f5e",
    bg: "#1f030a",
    symbol: "😭👌",
    sub: "Фирменный панчлайн стримов",
    tags: ["слезы", "нормалдаки", "стример", "цитата"],
  },
  {
    id: "meme_sadhamster",
    title: "ГРУСТНЫЙ ХОМЯК",
    quote: "Скрипка играет, а баланс на нуле",
    theme: "#cbd5e1",
    bg: "#111827",
    symbol: "🎻🐹",
    sub: "Вселенская грусть и глаза-бусинки",
    tags: ["грусть", "скрипка", "глаза", "печаль"],
  },
  {
    id: "meme_baza",
    title: "ЭТО БАЗА",
    quote: "База кормит, база спасает",
    theme: "#3b82f6",
    bg: "#051329",
    symbol: "🏛️",
    sub: "Неоспоримая истина интернета",
    tags: ["база", "истина", "аргумент", "фундамент"],
  },
  {
    id: "meme_oguzok",
    title: "ОГУЗОК",
    quote: "Шеф, вы великий человек!",
    theme: "#15803d",
    bg: "#05170a",
    symbol: "🥒🍳",
    sub: "На кухне ресторана Клод Моне",
    tags: ["шеф", "кухня", "огузок", "косяк"],
  },
  {
    id: "meme_chinazes",
    title: "ЧИНАЗЕС",
    quote: "Сюдааа! Отдыхаем на чилле",
    theme: "#8b5cf6",
    bg: "#100824",
    symbol: "🤙🍹",
    sub: "Полное душевное благополучие",
    tags: ["отдых", "кайф", "сюла", "чиназес"],
  },
  {
    id: "meme_sigma",
    title: "СИГМА БОЙ",
    quote: "Ты не сигма, я сигма бой!",
    theme: "#475569",
    bg: "#0f172a",
    symbol: "🗿",
    sub: "Каменное лицо и взгляд исподлобья",
    tags: ["сигма", "фонк", "гигачад", "патрик"],
  },
  {
    id: "meme_shiz",
    title: "ТАБЛЕТКИ ОТ ШИЗЫ",
    quote: "Принял таблетку — друзья исчезли",
    theme: "#e11d48",
    bg: "#1f0308",
    symbol: "💊",
    sub: "Одиночество в пустой комнате",
    tags: ["таблетки", "шиза", "галлюцинации", "кот"],
  },
];

function generateSvg(m) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" width="100%" height="100%">
  <rect width="540" height="960" fill="${m.bg}"/>
  
  <!-- Subtle flat geometric accent -->
  <rect x="0" y="0" width="540" height="12" fill="${m.theme}"/>
  <rect x="36" y="60" width="8" height="48" fill="${m.theme}"/>
  
  <!-- Top Meme Meta -->
  <text x="56" y="92" fill="${m.theme}" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" letter-spacing="2">MEMEGINARIUM 2026</text>
  
  <!-- Center Visual Motif -->
  <g transform="translate(270, 400)">
    <circle r="160" fill="${m.theme}" fill-opacity="0.1"/>
    <circle r="120" fill="${m.theme}" fill-opacity="0.2"/>
    <text text-anchor="middle" dominant-baseline="central" font-size="110">${m.symbol}</text>
  </g>
  
  <!-- Title -->
  <text x="40" y="660" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="900" letter-spacing="-0.5">${m.title}</text>
  
  <!-- Quote -->
  <text x="40" y="715" fill="#e2e8f0" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="500">«${m.quote}»</text>
  
  <!-- Subtitle -->
  <text x="40" y="765" fill="${m.theme}" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600">${m.sub}</text>
  
  <!-- Tags -->
  <g transform="translate(40, 840)">
    ${m.tags
      .slice(0, 3)
      .map(
        (t, idx) =>
          `<text x="${idx * 150}" y="0" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600">#${t}</text>`
      )
      .join("")}
  </g>
</svg>`;
}

const outDir = path.resolve("public/memes");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (const m of memes) {
  const filePath = path.join(outDir, `${m.id}.svg`);
  fs.writeFileSync(filePath, generateSvg(m), "utf8");
}

console.log(`Generated ${memes.length} meme cards in public/memes/`);
