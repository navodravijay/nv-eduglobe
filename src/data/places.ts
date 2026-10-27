import { photos } from './photos'

export type Language = 'en' | 'si'
export type Localized = Record<Language, string>
export const text = (en: string, si: string): Localized => ({ en, si })
export type ContinentId =
  'asia' | 'africa' | 'europe' | 'north-america' | 'south-america' | 'australia' | 'antarctica'
export type Category = 'country' | 'heritage' | 'nature' | 'city'
export interface Place {
  id: string
  name: Localized
  region: Localized
  continent: ContinentId
  category: Category
  lat: number
  lng: number
  description: Localized
  fact: Localized
  source: { name: string; url: string }
  image?: string
  imageAlt?: Localized
  imageCredit?: string
  imageSource?: string
  sriLanka?: boolean
}

export const continents: {
  id: ContinentId
  name: Localized
  lat: number
  lng: number
  description: Localized
}[] = [
  {
    id: 'asia',
    name: text('Asia', 'ආසියාව'),
    lat: 30,
    lng: 85,
    description: text(
      'The largest continent spans Arctic tundra, tropical islands and the Himalayas. Sri Lanka lies in the Indian Ocean, south of India.',
      'විශාලතම මහාද්වීපය වන ආසියාවේ හිම කලාප, නිවර්තන දූපත් සහ හිමාලය පිහිටා ඇත. ශ්‍රී ලංකාව ඉන්දියාවට දකුණින් ඉන්දියානු සාගරයේ පිහිටයි.',
    ),
  },
  {
    id: 'africa',
    name: text('Africa', 'අප්‍රිකාව'),
    lat: 3,
    lng: 20,
    description: text(
      'The equator crosses Africa. Its landscapes range from the Sahara in the north to equatorial rainforests and southern grasslands.',
      'සමකය අප්‍රිකාව හරහා ගමන් කරයි. උතුරේ සහරා කාන්තාරයේ සිට සමක වැසි වනාන්තර සහ දකුණේ තෘණ භූමි දක්වා එහි භූ දර්ශන විවිධය.',
    ),
  },
  {
    id: 'europe',
    name: text('Europe', 'යුරෝපය'),
    lat: 50,
    lng: 15,
    description: text(
      'Europe shares the Eurasian landmass with Asia. The Alps, Mediterranean coast and northern fjords reveal very different physical landscapes.',
      'යුරෝපය සහ ආසියාව එකම යුරේසියානු භූමිය බෙදා ගනී. ඇල්ප්ස් කඳු, මධ්‍යධරණී වෙරළ සහ උතුරු ෆ්යෝඩ් එහි විවිධ භූ ලක්ෂණ පෙන්වයි.',
    ),
  },
  {
    id: 'north-america',
    name: text('North America', 'උතුරු ඇමරිකාව'),
    lat: 40,
    lng: -100,
    description: text(
      'From Arctic islands to tropical Central America, this continent includes the Rocky Mountains, Great Lakes and the Grand Canyon.',
      'ආක්ටික් දූපත් සිට නිවර්තන මධ්‍යම ඇමරිකාව දක්වා විහිදෙන මෙහි රොකී කඳු, මහා විල් සහ ග්‍රෑන්ඩ් කැනියන් පිහිටයි.',
    ),
  },
  {
    id: 'south-america',
    name: text('South America', 'දකුණු ඇමරිකාව'),
    lat: -18,
    lng: -60,
    description: text(
      'The Andes follow the western edge of South America. The Amazon Basin supports an immense tropical rainforest and river system.',
      'ඇන්ඩීස් කඳු දකුණු ඇමරිකාවේ බටහිර මායිම දිගේ විහිදේ. ඇමසන් ද්‍රෝණියේ විශාල නිවර්තන වැසි වනාන්තරයක් සහ ගංගා පද්ධතියක් ඇත.',
    ),
  },
  {
    id: 'australia',
    name: text('Australia', 'ඕස්ට්‍රේලියාව'),
    lat: -25,
    lng: 134,
    description: text(
      'Australia is the smallest of the seven continents. It belongs to the wider Oceania region, which also includes many Pacific islands.',
      'ඕස්ට්‍රේලියාව මහාද්වීප හතෙන් කුඩාම එකයි. පැසිෆික් දූපත් රැසක්ද ඇතුළත් පුළුල් ඕෂනියා කලාපයට එය අයත් වේ.',
    ),
  },
  {
    id: 'antarctica',
    name: text('Antarctica', 'ඇන්ටාක්ටිකාව'),
    lat: -80,
    lng: 0,
    description: text(
      'An ice-covered continent surrounds the South Pole. Antarctica has no permanent native human population; research stations host scientific teams.',
      'දක්ෂිණ ධ්‍රැවය වටා ඇති මෙම මහාද්වීපය හිමෙන් වැසී ඇත. ස්ථිර ස්වදේශික ජනගහනයක් නොමැති අතර පර්යේෂණ මධ්‍යස්ථානවල විද්‍යාඥයෝ සේවය කරති.',
    ),
  },
]

export const categories: { id: Category; name: Localized }[] = [
  { id: 'country', name: text('Countries', 'රටවල්') },
  { id: 'heritage', name: text('Culture & heritage', 'සංස්කෘතිය හා උරුමය') },
  { id: 'nature', name: text('Natural wonders', 'ස්වභාවික අසිරි') },
  { id: 'city', name: text('Cities', 'නගර') },
]

const destinationData: Place[] = [
  {
    id: 'sigiriya',
    name: text('Sigiriya', 'සීගිරිය'),
    region: text('Sri Lanka', 'ශ්‍රී ලංකාව'),
    continent: 'asia',
    category: 'heritage',
    lat: 7.957,
    lng: 80.7603,
    sriLanka: true,
    image: '/assets/sigiriya.jpg',
    description: text(
      'A royal citadel rises above the forests of central Sri Lanka. Built during King Kassapa I’s reign in the fifth century, Sigiriya brings together rock architecture, painted frescoes and carefully planned water gardens.',
      'මධ්‍යම ශ්‍රී ලංකාවේ වනාන්තරවලට ඉහළින් නැඟෙන සීගිරිය, පස්වන සියවසේ කාශ්‍යප රජුගේ පාලන සමයේ ඉදි වූ රාජකීය බලකොටුවකි. ගල් ගෘහ නිර්මාණ, බිතුසිතුවම් සහ සැලසුම් කළ ජල උද්‍යාන මෙහි එක් වේ.',
    ),
    fact: text(
      'Inscribed on the UNESCO World Heritage List in 1982.',
      '1982 වසරේ යුනෙස්කෝ ලෝක උරුම ලැයිස්තුවට ඇතුළත් විය.',
    ),
    source: { name: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/202/' },
  },
  {
    id: 'kandy',
    name: text('Kandy', 'මහනුවර'),
    region: text('Sri Lanka', 'ශ්‍රී ලංකාව'),
    continent: 'asia',
    category: 'heritage',
    lat: 7.2936,
    lng: 80.6403,
    sriLanka: true,
    description: text(
      'In Sri Lanka’s central hills, Kandy preserves the heritage of the island’s last Sinhala kingdom. The Temple of the Sacred Tooth Relic remains an important Buddhist pilgrimage destination.',
      'ශ්‍රී ලංකාවේ මධ්‍යම කඳුකරයේ පිහිටි මහනුවර, අවසන් සිංහල රාජධානියේ උරුමය රැක ගනී. ශ්‍රී දළදා මාළිගාව බෞද්ධ බැතිමතුන්ගේ වැදගත් වන්දනා ස්ථානයකි.',
    ),
    fact: text(
      'The Sacred City of Kandy became a World Heritage Site in 1988.',
      'මහනුවර පූජනීය නගරය 1988 දී ලෝක උරුමයක් විය.',
    ),
    source: { name: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/450/' },
  },
  {
    id: 'galle',
    name: text('Galle Fort', 'ගාලු කොටුව'),
    region: text('Sri Lanka', 'ශ්‍රී ලංකාව'),
    continent: 'asia',
    category: 'heritage',
    lat: 6.0267,
    lng: 80.2175,
    sriLanka: true,
    description: text(
      'On Sri Lanka’s southwest coast, Galle’s fortified old town records centuries of Indian Ocean exchange. Its streets and buildings combine European planning with South Asian architectural traditions.',
      'ශ්‍රී ලංකාවේ නිරිතදිග වෙරළේ ගාලු කොටුව ඉන්දියානු සාගර වෙළඳ ඉතිහාසය කියාපායි. එහි වීදි සහ ගොඩනැගිලි යුරෝපීය සැලසුම් හා දකුණු ආසියානු ගෘහ නිර්මාණ සම්ප්‍රදාය එක් කරයි.',
    ),
    fact: text(
      'The old town and its fortifications were listed by UNESCO in 1988.',
      'පැරණි නගරය සහ බලකොටු 1988 දී යුනෙස්කෝ ලැයිස්තුවට ඇතුළත් විය.',
    ),
    source: { name: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/451/' },
  },
  {
    id: 'ella',
    name: text('Ella', 'ඇල්ල'),
    region: text('Sri Lanka', 'ශ්‍රී ලංකාව'),
    continent: 'asia',
    category: 'nature',
    lat: 6.8667,
    lng: 81.0466,
    sriLanka: true,
    description: text(
      'Ella is a small hill-country town surrounded by tea-growing slopes. The Ella Gap opens a view towards Sri Lanka’s southern lowlands, illustrating how elevation shapes the island’s landscapes.',
      'තේ වගා කළ බෑවුම් අතර පිහිටි ඇල්ල කුඩා කඳුකර නගරයකි. ඇල්ල කපොල්ලෙන් දකුණු පහත් බිම් දිස් වන අතර උන්නතාංශය දිවයිනේ භූ දර්ශනය හැඩගස්වන ආකාරය මෙහි දැකිය හැක.',
    ),
    fact: text(
      'The town sits roughly 1,000 metres above sea level.',
      'නගරය මුහුදු මට්ටමේ සිට ආසන්න වශයෙන් මීටර් 1,000ක් උසින් පිහිටයි.',
    ),
    source: { name: 'Sri Lanka Tourism', url: 'https://www.srilanka.travel/ella' },
  },
  {
    id: 'colombo',
    name: text('Colombo', 'කොළඹ'),
    region: text('Sri Lanka', 'ශ්‍රී ලංකාව'),
    continent: 'asia',
    category: 'city',
    lat: 6.9271,
    lng: 79.8612,
    sriLanka: true,
    description: text(
      'Colombo is a major commercial city and port on Sri Lanka’s western coast. Its Indian Ocean location connects the island with maritime trade routes; Sri Jayewardenepura Kotte is the legislative capital.',
      'බටහිර වෙරළේ කොළඹ ශ්‍රී ලංකාවේ ප්‍රධාන වාණිජ නගරයක් සහ වරායකි. ඉන්දියානු සාගරයේ එහි පිහිටීම නාවික වෙළඳ මාර්ග සමඟ දිවයින සම්බන්ධ කරයි. ව්‍යවස්ථාදායක අගනුවර ශ්‍රී ජයවර්ධනපුර කෝට්ටේ ය.',
    ),
    fact: text(
      'A coastal city shaped by centuries of maritime exchange.',
      'සියවස් ගණනක නාවික හුවමාරුවෙන් හැඩගැසුණු වෙරළබඩ නගරයකි.',
    ),
    source: { name: 'Sri Lanka Tourism', url: 'https://www.srilanka.travel/colombo' },
  },
  {
    id: 'sri-lanka',
    name: text('Sri Lanka', 'ශ්‍රී ලංකාව'),
    region: text('Indian Ocean', 'ඉන්දියානු සාගරය'),
    continent: 'asia',
    category: 'country',
    lat: 7.8731,
    lng: 80.7718,
    description: text(
      'An island country south of India, Sri Lanka brings tropical coasts, central highlands and ancient cities into a compact area. Monsoons help shape its wet and dry climatic zones.',
      'ඉන්දියාවට දකුණින් පිහිටි ශ්‍රී ලංකාව නිවර්තන වෙරළ, මධ්‍යම කඳුකරය සහ පුරාණ නගර සහිත දූපත් රාජ්‍යයකි. මෝසම් වැසි එහි තෙත් හා වියළි දේශගුණික කලාප හැඩගස්වයි.',
    ),
    fact: text(
      'Sri Lanka has eight UNESCO World Heritage Sites.',
      'ශ්‍රී ලංකාවේ යුනෙස්කෝ ලෝක උරුම අටක් ඇත.',
    ),
    source: { name: 'UNESCO — Sri Lanka', url: 'https://whc.unesco.org/en/statesparties/lk' },
  },
  {
    id: 'japan',
    name: text('Japan', 'ජපානය'),
    region: text('East Asia', 'නැගෙනහිර ආසියාව'),
    continent: 'asia',
    category: 'country',
    lat: 36.2048,
    lng: 138.2529,
    description: text(
      'Japan is an island country in the northwest Pacific. Its mountainous islands sit near tectonic plate boundaries, where earthquakes and volcanic activity shape the land.',
      'වයඹ පැසිෆික් සාගරයේ පිහිටි ජපානය දූපත් රාජ්‍යයකි. එහි කඳුකර දූපත් භූ තැටි මායිම් අසල පිහිටන බැවින් භූමිකම්පා සහ ගිනිකඳු ක්‍රියාකාරකම් භූමිය හැඩගස්වයි.',
    ),
    fact: text(
      'Honshu, Hokkaido, Kyushu and Shikoku are its four main islands.',
      'හොන්ෂු, හොකයිඩෝ, කියුෂු සහ ෂිකෝකු එහි ප්‍රධාන දූපත් හතරයි.',
    ),
    source: {
      name: 'Japan Ministry of Land, Infrastructure, Transport and Tourism',
      url: 'https://www.mlit.go.jp/river/basic_info/english/land.html',
    },
  },
  {
    id: 'egypt',
    name: text('Egypt', 'ඊජිප්තුව'),
    region: text('Northeast Africa', 'ඊසානදිග අප්‍රිකාව'),
    continent: 'africa',
    category: 'country',
    lat: 26.8206,
    lng: 30.8025,
    description: text(
      'Egypt connects northeast Africa with Asia through the Sinai Peninsula. The Nile Valley has supported settlements and agriculture within an otherwise largely desert landscape for thousands of years.',
      'සීනායි අර්ධද්වීපය හරහා ඊජිප්තුව ඊසානදිග අප්‍රිකාව ආසියාවට සම්බන්ධ කරයි. බොහෝ දුරට කාන්තාර භූමියක් වුවද නයිල් නිම්නය වසර දහස් ගණනක් ජනාවාස සහ කෘෂිකර්මය පෝෂණය කර ඇත.',
    ),
    fact: text(
      'The Nile flows northwards towards the Mediterranean Sea.',
      'නයිල් ගඟ උතුරට මධ්‍යධරණී මුහුද දෙසට ගලා යයි.',
    ),
    source: {
      name: 'Egyptian Ministry of Tourism and Antiquities',
      url: 'https://egymonuments.gov.eg/',
    },
  },
  {
    id: 'france',
    name: text('France', 'ප්‍රංශය'),
    region: text('Western Europe', 'බටහිර යුරෝපය'),
    continent: 'europe',
    category: 'country',
    lat: 46.2276,
    lng: 2.2137,
    description: text(
      'Metropolitan France extends from Atlantic shores to the Mediterranean and the Alps. Its mainland landscapes include river basins, fertile plains and high mountain ranges.',
      'ප්‍රංශයේ යුරෝපීය භූමිය අත්ලාන්තික් වෙරළේ සිට මධ්‍යධරණී මුහුද සහ ඇල්ප්ස් දක්වා විහිදේ. ගංගා ද්‍රෝණි, සරු තැනිතලා සහ උස් කඳු එහි දක්නට ලැබේ.',
    ),
    fact: text('Paris stands on the River Seine.', 'පැරිස් නගරය සේන් ගඟ අසබඩ පිහිටයි.'),
    source: { name: 'France.fr', url: 'https://www.france.fr/en/' },
  },
  {
    id: 'usa',
    name: text('United States', 'ඇමරිකා එක්සත් ජනපදය'),
    region: text('North America', 'උතුරු ඇමරිකාව'),
    continent: 'north-america',
    category: 'country',
    lat: 39.8283,
    lng: -98.5795,
    description: text(
      'The United States includes landscapes from Alaska’s Arctic to Hawaii’s volcanic islands. The contiguous states stretch between the Atlantic and Pacific oceans.',
      'ඇමරිකා එක්සත් ජනපදයට ඇලස්කාවේ ආක්ටික් කලාපයේ සිට හවායි ගිනිකඳු දූපත් දක්වා විවිධ භූ දර්ශන අයත් වේ. යාබද ප්‍රාන්ත අත්ලාන්තික් හා පැසිෆික් සාගර අතර විහිදේ.',
    ),
    fact: text(
      'The country has 50 states; Alaska and Hawaii are separate from the contiguous 48.',
      'රටට ප්‍රාන්ත 50ක් ඇත. ඇලස්කාව සහ හවායි අනෙක් යාබද ප්‍රාන්ත 48න් වෙන්ව පිහිටයි.',
    ),
    source: { name: 'US Geological Survey', url: 'https://www.usgs.gov/' },
  },
  {
    id: 'brazil',
    name: text('Brazil', 'බ්‍රසීලය'),
    region: text('South America', 'දකුණු ඇමරිකාව'),
    continent: 'south-america',
    category: 'country',
    lat: -14.235,
    lng: -51.9253,
    description: text(
      'Brazil is the largest country in South America by area. Its landscapes include much of the Amazon Basin, the Cerrado savanna and a long Atlantic coastline.',
      'වර්ගඵලය අනුව දකුණු ඇමරිකාවේ විශාලතම රට බ්‍රසීලයයි. ඇමසන් ද්‍රෝණියේ විශාල කොටසක්, සෙරාඩෝ සැවානා සහ දිගු අත්ලාන්තික් වෙරළක් එයට අයත් වේ.',
    ),
    fact: text(
      'The equator passes through northern Brazil.',
      'සමකය උතුරු බ්‍රසීලය හරහා ගමන් කරයි.',
    ),
    source: {
      name: 'Brazilian Institute of Geography and Statistics',
      url: 'https://www.ibge.gov.br/en/',
    },
  },
  {
    id: 'australia-country',
    name: text('Australia', 'ඕස්ට්‍රේලියාව'),
    region: text('Oceania', 'ඕෂනියාව'),
    continent: 'australia',
    category: 'country',
    lat: -25.2744,
    lng: 133.7751,
    description: text(
      'Australia is both a country and the name of a continent in the seven-continent model. Its interior is largely arid, while tropical, temperate and coastal environments surround it.',
      'මහාද්වීප හතේ ආකෘතිය අනුව ඕස්ට්‍රේලියාව රටක සහ මහාද්වීපයක නමකි. රට අභ්‍යන්තරය බොහෝ දුරට ශුෂ්ක වන අතර නිවර්තන, සෞම්‍ය සහ වෙරළ පරිසර එය වට කරයි.',
    ),
    fact: text('Canberra is Australia’s capital city.', 'කැන්බරා ඕස්ට්‍රේලියාවේ අගනුවරයි.'),
    source: {
      name: 'Geoscience Australia',
      url: 'https://www.ga.gov.au/scientific-topics/national-location-information/dimensions',
    },
  },
  {
    id: 'everest',
    name: text('Mount Everest', 'එවරස්ට් කන්ද'),
    region: text('Nepal · China', 'නේපාලය · චීනය'),
    continent: 'asia',
    category: 'nature',
    lat: 27.9881,
    lng: 86.925,
    description: text(
      'At the Nepal–China border, Mount Everest rises in the Himalayas. The collision of the Indian and Eurasian tectonic plates formed this immense mountain range.',
      'නේපාල–චීන දේශසීමාවේ එවරස්ට් කන්ද හිමාලයේ ඉහළට නැඟේ. ඉන්දියානු සහ යුරේසියානු භූ තැටි ගැටීමෙන් මෙම විශාල කඳු පන්තිය ඇති විය.',
    ),
    fact: text(
      'Its agreed elevation is 8,848.86 metres above sea level.',
      'එහි පිළිගත් උස මුහුදු මට්ටමේ සිට මීටර් 8,848.86කි.',
    ),
    source: {
      name: 'UNESCO — Sagarmatha National Park',
      url: 'https://whc.unesco.org/en/list/120/',
    },
  },
  {
    id: 'giza',
    name: text('Pyramids of Giza', 'ගීසා පිරමීඩ'),
    region: text('Egypt', 'ඊජිප්තුව'),
    continent: 'africa',
    category: 'heritage',
    lat: 29.9792,
    lng: 31.1342,
    description: text(
      'On the Giza Plateau near Cairo, monumental pyramids preserve the legacy of ancient Egypt’s Old Kingdom. The Great Pyramid was built for the pharaoh Khufu.',
      'කයිරෝ අසල ගීසා සානුවේ පිරමීඩ පුරාණ ඊජිප්තු පැරණි රාජධානියේ උරුමය රැක ගනී. මහා පිරමීඩය කුෆු පාරාවෝ වෙනුවෙන් ඉදි කරන ලදී.',
    ),
    fact: text(
      'The Great Pyramid is the surviving wonder of the ancient Seven Wonders.',
      'පුරාණ ලෝකයේ පුදුම හතෙන් අදටත් පවතින්නේ මහා පිරමීඩයයි.',
    ),
    source: {
      name: 'Egyptian Ministry of Tourism and Antiquities',
      url: 'https://egymonuments.gov.eg/monuments/the-great-pyramid/',
    },
  },
  {
    id: 'eiffel',
    name: text('Eiffel Tower', 'අයිෆල් කුළුණ'),
    region: text('Paris · France', 'පැරිස් · ප්‍රංශය'),
    continent: 'europe',
    category: 'heritage',
    lat: 48.8584,
    lng: 2.2945,
    description: text(
      'Built for the 1889 World’s Fair, the Eiffel Tower is a landmark of iron engineering beside the Seine. It offers a way to connect geography with the history of cities and technology.',
      '1889 ලෝක ප්‍රදර්ශනය සඳහා ඉදි කළ අයිෆල් කුළුණ සේන් ගඟ අසල යකඩ ඉංජිනේරු සලකුණකි. එය භූගෝල විද්‍යාව නගර සහ තාක්ෂණ ඉතිහාසයට සම්බන්ධ කරයි.',
    ),
    fact: text('The tower opened in 1889.', 'කුළුණ 1889 දී විවෘත කරන ලදී.'),
    source: {
      name: 'Official Eiffel Tower website',
      url: 'https://www.toureiffel.paris/en/the-monument/history',
    },
  },
  {
    id: 'grand-canyon',
    name: text('Grand Canyon', 'ග්‍රෑන්ඩ් කැනියන්'),
    region: text('Arizona · United States', 'ඇරිසෝනා · එක්සත් ජනපදය'),
    continent: 'north-america',
    category: 'nature',
    lat: 36.1069,
    lng: -112.1129,
    description: text(
      'The Colorado River and its tributaries carved a vast canyon into the Colorado Plateau. Exposed rock layers reveal a long geological record of changing environments.',
      'කොලරාඩෝ ගඟ සහ එහි අතු ගංගා කොලරාඩෝ සානුව තුළ විශාල නිම්නයක් කැටයම් කළේය. නිරාවරණය වූ පාෂාණ ස්ථර වෙනස් වූ පරිසරවල දිගු භූ විද්‍යාත්මක වාර්තාවක් පෙන්වයි.',
    ),
    fact: text(
      'The canyon demonstrates erosion acting over millions of years.',
      'වසර මිලියන ගණනක ඛාදනයේ ප්‍රතිඵල මෙම නිම්නය පෙන්වයි.',
    ),
    source: {
      name: 'US National Park Service',
      url: 'https://www.nps.gov/grca/learn/nature/grca-geology.htm',
    },
  },
  {
    id: 'amazon',
    name: text('Amazon Rainforest', 'ඇමසන් වැසි වනාන්තරය'),
    region: text('Amazon Basin · Brazil', 'ඇමසන් ද්‍රෝණිය · බ්‍රසීලය'),
    continent: 'south-america',
    category: 'nature',
    lat: -3.4653,
    lng: -62.2159,
    description: text(
      'The Amazon rainforest spreads across several South American countries. Its rivers and forests support exceptional biodiversity and play a major role in the movement of water and carbon.',
      'ඇමසන් වැසි වනාන්තරය දකුණු ඇමරිකානු රටවල් කිහිපයක් පුරා විහිදේ. එහි ගංගා සහ වනාන්තර ඉහළ ජෛව විවිධත්වයක් පෝෂණය කරන අතර ජල හා කාබන් චක්‍රවල වැදගත් කාර්යයක් ඉටු කරයි.',
    ),
    fact: text(
      'This marker is a representative point in the Brazilian Amazon, not a boundary.',
      'මෙය බ්‍රසීල ඇමසන් කලාපයේ නියෝජිත ස්ථානයක් මිස මායිමක් නොවේ.',
    ),
    source: {
      name: 'NASA Earth Observatory',
      url: 'https://earthobservatory.nasa.gov/biome/biorainforest.php',
    },
  },
  {
    id: 'machu-picchu',
    name: text('Machu Picchu', 'මාචු පික්චු'),
    region: text('Peru', 'පේරු'),
    continent: 'south-america',
    category: 'heritage',
    lat: -13.1631,
    lng: -72.545,
    description: text(
      'High in the Peruvian Andes, Machu Picchu combines Inca stonework with a dramatic mountain landscape. Terraces show how people adapted agriculture and construction to steep terrain.',
      'පේරු ඇන්ඩීස් කඳුකරයේ මාචු පික්චු ඉන්කා ගල් නිර්මාණ හා කඳුකර භූ දර්ශනය එක් කරයි. බෑවුම් සහිත භූමියට කෘෂිකර්මය සහ ඉදිකිරීම් ගැළපූ ආකාරය එහි හෙල්මළු පෙන්වයි.',
    ),
    fact: text(
      'A UNESCO mixed site, recognized for both cultural and natural value.',
      'සංස්කෘතික සහ ස්වභාවික වටිනාකම් දෙකම සඳහා පිළිගත් මිශ්‍ර යුනෙස්කෝ උරුමයකි.',
    ),
    source: { name: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/274/' },
  },
  {
    id: 'great-barrier-reef',
    name: text('Great Barrier Reef', 'මහා බාධක පරය'),
    region: text('Queensland · Australia', 'ක්වීන්ස්ලන්ඩ් · ඕස්ට්‍රේලියාව'),
    continent: 'australia',
    category: 'nature',
    lat: -18.2871,
    lng: 147.6992,
    description: text(
      'Off Australia’s northeast coast, the Great Barrier Reef is an extensive system of coral reefs and islands. Reef-building corals depend on a close relationship with microscopic algae.',
      'ඕස්ට්‍රේලියාවේ ඊසානදිග වෙරළට ඔබ්බෙන් මහා බාධක පරය කොරල් පර සහ දූපත් විශාල පද්ධතියකි. පර සාදන කොරල් ක්ෂුද්‍ර ඇල්ගී සමඟ සමීප සබඳතාවක් මත රඳා පවතී.',
    ),
    fact: text(
      'Warmer water can stress corals and cause coral bleaching.',
      'උණුසුම් ජලය කොරල්වලට පීඩනයක් ඇති කර කොරල් විරංජනයට හේතු විය හැක.',
    ),
    source: {
      name: 'Great Barrier Reef Marine Park Authority',
      url: 'https://www.gbrmpa.gov.au/learn',
    },
  },
  {
    id: 'south-pole',
    name: text('South Pole', 'දක්ෂිණ ධ්‍රැවය'),
    region: text('Antarctica', 'ඇන්ටාක්ටිකාව'),
    continent: 'antarctica',
    category: 'nature',
    lat: -90,
    lng: 0,
    description: text(
      'The geographic South Pole is where Earth’s rotation axis meets its southern surface. It lies on Antarctica’s high ice sheet, far from the coast.',
      'භූගෝලීය දක්ෂිණ ධ්‍රැවය යනු පෘථිවියේ භ්‍රමණ අක්ෂය දකුණු පෘෂ්ඨය හමුවන ස්ථානයයි. එය වෙරළෙන් ඈත ඇන්ටාක්ටිකාවේ උස් හිම තට්ටුව මත පිහිටයි.',
    ),
    fact: text(
      'All lines of longitude meet here; the marker uses 0° by convention.',
      'සියලු දේශාංශ මෙහි හමු වේ. සලකුණ සඳහා සම්මුතියක් ලෙස 0° භාවිත කරයි.',
    ),
    source: {
      name: 'US Antarctic Program',
      url: 'https://www.usap.gov/videoclipsandmaps/spwebcam.cfm',
    },
  },
]

export const places: Place[] = destinationData.map((place) => {
  const photo = photos[place.id]
  return photo
    ? {
        ...place,
        image: photo.src,
        imageAlt: photo.alt,
        imageCredit: photo.credit,
        imageSource: photo.source,
      }
    : place
})

export const tourIds = [
  'sigiriya',
  'giza',
  'eiffel',
  'grand-canyon',
  'machu-picchu',
  'great-barrier-reef',
]

export function searchPlaces(
  query: string,
  continent: string = 'all',
  category: string = 'all',
): Place[] {
  const normalized = query.normalize('NFKC').trim().toLocaleLowerCase().slice(0, 100)
  return places.filter(
    (place) =>
      (continent === 'all' || place.continent === continent) &&
      (category === 'all' || place.category === category) &&
      [place.name.en, place.name.si, place.region.en, place.region.si].some((value) =>
        value.toLocaleLowerCase().includes(normalized),
      ),
  )
}

export function formatCoordinate(value: number, axis: 'lat' | 'lng'): string {
  return `${Math.abs(value).toFixed(2)}° ${axis === 'lat' ? (value < 0 ? 'S' : 'N') : value < 0 ? 'W' : 'E'}`
}
