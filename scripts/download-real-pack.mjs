import fs from "node:fs";
import path from "node:path";

const memes = [
  {
    id: "meme_phone",
    url: "https://media.tenor.com/B9Tp6CPdeOUAAAA1/slap-turn-off-camera.webp",
    file: "meme_phone.webp",
    name: "Убери телефон",
  },
  {
    id: "meme_air",
    url: "https://media.tenor.com/qgrHA6RFg4EAAAA1/electric-fan-wind.webp",
    file: "meme_air.webp",
    name: "Воздухан",
  },
  {
    id: "meme_67",
    url: "https://media.tenor.com/a-AWOlobpTQAAAA1/67-67-meme.webp",
    file: "meme_67.webp",
    name: "67 (Сикс-севен)",
  },
  {
    id: "meme_chigur",
    url: "https://media.tenor.com/PaT5_nnNU2oAAAA1/anton-chigurh.webp",
    file: "meme_chigur.webp",
    name: "Антон Чигур",
  },
  {
    id: "meme_telifon",
    url: "https://media.tenor.com/hx4UEKWirAsAAAA1/telephone-call.webp",
    file: "meme_telifon.webp",
    name: "Телифон",
  },
  {
    id: "meme_brdysh",
    url: "https://media.tenor.com/mWFXb_pyP_QAAAA1/leonid-brezhnev-brezhnev.webp",
    file: "meme_brdysh.webp",
    name: "Брдыщ (Брежнев)",
  },
  {
    id: "meme_cheremsha",
    url: "https://media.tenor.com/5XuG8c3BGfwAAAA1/cat-wisky-chill.webp",
    file: "meme_cheremsha.webp",
    name: "Кот Степан",
  },
  {
    id: "meme_rave",
    url: "https://media.tenor.com/d43YaOYfp3gAAAA1/bombardino-crocodillo-trallalera-trallala.webp",
    file: "meme_rave.webp",
    name: "Бомбардиро Крокодило",
  },
  {
    id: "meme_maga",
    url: "https://media.tenor.com/oI_NDeedni8AAAA1/chechen-dance-chechen.webp",
    file: "meme_maga.webp",
    name: "Мага, сияй (Лезгинка)",
  },
  {
    id: "meme_bobr",
    url: "https://media.tenor.com/YVONTGkl9W0AAAA1/bubr-bobr.webp",
    file: "meme_bobr.webp",
    name: "Бобр курва",
  },
  {
    id: "meme_42",
    url: "https://media.tenor.com/dKjjq0UCp2oAAAA1/5opka.webp",
    file: "meme_42.webp",
    name: "42 Братухи (5opka)",
  },
  {
    id: "meme_chill",
    url: "https://media.tenor.com/FetQ_KhWgd4AAAA1/chill-guy.webp",
    file: "meme_chill.webp",
    name: "Chill Guy",
  },
  {
    id: "meme_quadro",
    url: "https://media.tenor.com/aov_xL6kxk8AAAA1/girl-jumping-around-like-a-wolf.webp",
    file: "meme_quadro.webp",
    name: "Квадроберы",
  },
  {
    id: "meme_okak",
    url: "https://media.tenor.com/7l4PXSCFjjQAAAA1/huh-cat.webp",
    file: "meme_okak.webp",
    name: "Huh Cat (Окак)",
  },
  {
    id: "meme_zolotko",
    url: "https://media.tenor.com/AE7jyG0Ws_gAAAAm/ivanzolo2004-ivanzolo.webp",
    file: "meme_zolotko.webp",
    name: "Иван Золо",
  },
  {
    id: "meme_dikec",
    url: "https://media.tenor.com/8I_8uAT_iF4AAAA1/yusuf-dikec-lock-in.webp",
    file: "meme_dikec.webp",
    name: "Юсуф Дикеч",
  },
  {
    id: "meme_dubai",
    url: "https://media.tenor.com/K6q2Ru13v1oAAAA1/dubai-chocolate-dubai-schokolade.webp",
    file: "meme_dubai.webp",
    name: "Дубайский шоколад",
  },
  {
    id: "meme_skuf",
    url: "https://media.tenor.com/VhXBueUKIuMAAAA1/beer-skuf.webp",
    file: "meme_skuf.webp",
    name: "Скуф",
  },
  {
    id: "meme_hamster",
    url: "https://media.tenor.com/8VYARWBEh1IAAAAm/hamsterkombat-hamstercombat.webp",
    file: "meme_hamster.webp",
    name: "Тапай хомяка",
  },
  {
    id: "meme_plaki",
    url: "https://media.tenor.com/cuurymSbuxQAAAA1/zubarev-artem.webp",
    file: "meme_plaki.webp",
    name: "Зубарев (Плаки-плаки)",
  },
  {
    id: "meme_sadhamster",
    url: "https://media.tenor.com/OroVCOXbuUUAAAA1/sadhamstergirl.webp",
    file: "meme_sadhamster.webp",
    name: "Грустный хомяк",
  },
  {
    id: "meme_baza",
    url: "https://media.tenor.com/7TGvi_vnR0gAAAA1/chad-giga-chad.webp",
    file: "meme_baza.webp",
    name: "Это база (Гигачад)",
  },
  {
    id: "meme_oguzok",
    url: "https://media.tenor.com/kLr_wFUev4kAAAA1/oguzki-chef.webp",
    file: "meme_oguzok.webp",
    name: "Огузок (Шеф)",
  },
  {
    id: "meme_chinazes",
    url: "https://media.tenor.com/Rj6qkRCzubQAAAA1/chinese-man-cool-meme.webp",
    file: "meme_chinazes.webp",
    name: "Чиназес",
  },
  {
    id: "meme_sigma",
    url: "https://media.tenor.com/Py5fYTbsfakAAAA1/patrick-bateman.webp",
    file: "meme_sigma.webp",
    name: "Сигма бой (Патрик Бейтман)",
  },
  {
    id: "meme_shiz",
    url: "https://media.tenor.com/CIpEZiUQXKcAAAA1/papich.webp",
    file: "meme_shiz.webp",
    name: "Папич (Таблетки от шизы)",
  },
];

async function downloadAll() {
  const destDir = path.join(process.cwd(), "public", "memes");
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  console.log(`Starting download of ${memes.length} 100% REAL memes...`);
  let successCount = 0;

  for (const item of memes) {
    try {
      const res = await fetch(item.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (!res.ok) {
        console.error(`❌ HTTP ${res.status} for ${item.name} (${item.url})`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1000) {
        console.error(`❌ File too small (${buf.length} bytes) for ${item.name}`);
        continue;
      }
      const targetPath = path.join(destDir, item.file);
      fs.writeFileSync(targetPath, buf);
      console.log(`✅ [${++successCount}/${memes.length}] ${item.name}: ${item.file} (${buf.length} bytes)`);
    } catch (e) {
      console.error(`❌ Exception downloading ${item.name}:`, e.message);
    }
  }

  console.log(`\nFinished: ${successCount} of ${memes.length} downloaded successfully.`);
}

downloadAll();
