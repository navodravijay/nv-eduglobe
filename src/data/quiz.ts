import { text, type Localized } from './places'

export interface Question {
  question: Localized
  options: Localized[]
  correct: number
  explanation: Localized
}
export const questions: Question[] = [
  {
    question: text(
      'Which is the largest continent by land area?',
      'භූමි ප්‍රමාණයෙන් විශාලතම මහාද්වීපය කුමක්ද?',
    ),
    options: [
      text('Africa', 'අප්‍රිකාව'),
      text('Asia', 'ආසියාව'),
      text('Europe', 'යුරෝපය'),
      text('Australia', 'ඕස්ට්‍රේලියාව'),
    ],
    correct: 1,
    explanation: text(
      'Asia is the largest continent. It includes landscapes from Siberia to the tropical islands of Southeast Asia.',
      'ආසියාව විශාලතම මහාද්වීපයයි. සයිබීරියාවේ සිට අග්නිදිග ආසියානු නිවර්තන දූපත් දක්වා එය විහිදේ.',
    ),
  },
  {
    question: text(
      'In which ocean is Sri Lanka located?',
      'ශ්‍රී ලංකාව පිහිටා ඇත්තේ කුමන සාගරයේද?',
    ),
    options: [
      text('Atlantic', 'අත්ලාන්තික්'),
      text('Arctic', 'ආක්ටික්'),
      text('Pacific', 'පැසිෆික්'),
      text('Indian', 'ඉන්දියානු'),
    ],
    correct: 3,
    explanation: text(
      'Sri Lanka lies in the Indian Ocean, just south of India.',
      'ශ්‍රී ලංකාව ඉන්දියාවට දකුණින් ඉන්දියානු සාගරයේ පිහිටයි.',
    ),
  },
  {
    question: text(
      'Which Sri Lankan landmark is known as the Lion’s Rock?',
      'සිංහ පර්වතය ලෙස හැඳින්වෙන ශ්‍රී ලාංකික ස්ථානය කුමක්ද?',
    ),
    options: [
      text('Sigiriya', 'සීගිරිය'),
      text('Galle Fort', 'ගාලු කොටුව'),
      text('Ella', 'ඇල්ල'),
      text('Colombo', 'කොළඹ'),
    ],
    correct: 0,
    explanation: text(
      'Sigiriya’s entrance once took the form of a great lion. The large stone paws are still visible.',
      'සීගිරියට පිවිසුම විශාල සිංහයකුගේ හැඩයෙන් තිබුණි. විශාල සිංහ පාද අදත් දැකිය හැක.',
    ),
  },
  {
    question: text(
      'What process helped form the Grand Canyon?',
      'ග්‍රෑන්ඩ් කැනියන් සෑදීමට දායක වූ ක්‍රියාවලිය කුමක්ද?',
    ),
    options: [
      text('Coral growth', 'කොරල් වර්ධනය'),
      text('Meteor impact', 'උල්කාපාත ගැටීම'),
      text('River erosion', 'ගංගා ඛාදනය'),
      text('Volcanic eruption', 'ගිනිකඳු පිපිරීම'),
    ],
    correct: 2,
    explanation: text(
      'The Colorado River and its tributaries eroded the plateau over millions of years.',
      'කොලරාඩෝ ගඟ සහ එහි අතු ගංගා වසර මිලියන ගණනක් පුරා සානුව ඛාදනය කළේය.',
    ),
  },
  {
    question: text(
      'Which continent surrounds the South Pole?',
      'දක්ෂිණ ධ්‍රැවය වටා පිහිටි මහාද්වීපය කුමක්ද?',
    ),
    options: [
      text('Australia', 'ඕස්ට්‍රේලියාව'),
      text('Antarctica', 'ඇන්ටාක්ටිකාව'),
      text('South America', 'දකුණු ඇමරිකාව'),
      text('Africa', 'අප්‍රිකාව'),
    ],
    correct: 1,
    explanation: text(
      'The South Pole lies inland on Antarctica’s high ice sheet.',
      'දක්ෂිණ ධ්‍රැවය ඇන්ටාක්ටිකාවේ අභ්‍යන්තර උස් හිම තට්ටුව මත පිහිටයි.',
    ),
  },
  {
    question: text(
      'The Amazon rainforest is mainly on which continent?',
      'ඇමසන් වැසි වනාන්තරය ප්‍රධාන වශයෙන් පිහිටන මහාද්වීපය කුමක්ද?',
    ),
    options: [
      text('South America', 'දකුණු ඇමරිකාව'),
      text('Asia', 'ආසියාව'),
      text('Europe', 'යුරෝපය'),
      text('North America', 'උතුරු ඇමරිකාව'),
    ],
    correct: 0,
    explanation: text(
      'The Amazon Basin spans several South American countries, with the largest share in Brazil.',
      'ඇමසන් ද්‍රෝණිය දකුණු ඇමරිකානු රටවල් කිහිපයක් පුරා විහිදෙන අතර විශාලතම කොටස බ්‍රසීලයේ ඇත.',
    ),
  },
  {
    question: text('Where is the Great Barrier Reef?', 'මහා බාධක පරය පිහිටා ඇත්තේ කොහේද?'),
    options: [
      text('Near Japan', 'ජපානය අසල'),
      text('Off France', 'ප්‍රංශයට ඔබ්බෙන්'),
      text('Off northeast Australia', 'ඊසානදිග ඕස්ට්‍රේලියාවට ඔබ්බෙන්'),
      text('Near the South Pole', 'දක්ෂිණ ධ්‍රැවය අසල'),
    ],
    correct: 2,
    explanation: text(
      'The Great Barrier Reef lies in the Coral Sea off Queensland, Australia.',
      'මහා බාධක පරය ඕස්ට්‍රේලියාවේ ක්වීන්ස්ලන්ඩ් වෙරළට ඔබ්බෙන් කොරල් මුහුදේ පිහිටයි.',
    ),
  },
  {
    question: text(
      'Which city is home to the Temple of the Sacred Tooth Relic?',
      'ශ්‍රී දළදා මාළිගාව පිහිටා ඇති නගරය කුමක්ද?',
    ),
    options: [
      text('Galle', 'ගාල්ල'),
      text('Colombo', 'කොළඹ'),
      text('Ella', 'ඇල්ල'),
      text('Kandy', 'මහනුවර'),
    ],
    correct: 3,
    explanation: text(
      'The Temple of the Sacred Tooth Relic is in Kandy, in Sri Lanka’s central hills.',
      'ශ්‍රී දළදා මාළිගාව ශ්‍රී ලංකාවේ මධ්‍යම කඳුකරයේ මහනුවර පිහිටයි.',
    ),
  },
  {
    question: text(
      'Which line divides Earth into northern and southern hemispheres?',
      'පෘථිවිය උතුරු සහ දකුණු අර්ධගෝලවලට බෙදන රේඛාව කුමක්ද?',
    ),
    options: [
      text('Prime Meridian', 'ග්‍රිනිච් මධ්‍යහ්න රේඛාව'),
      text('Equator', 'සමකය'),
      text('Arctic Circle', 'ආක්ටික් වෘත්තය'),
      text('Tropic of Capricorn', 'මකර නිවර්තනය'),
    ],
    correct: 1,
    explanation: text(
      'The equator is at 0° latitude, halfway between the geographic poles.',
      'සමකය භූගෝලීය ධ්‍රැව දෙක අතර මැදින් 0° අක්ෂාංශයේ පිහිටයි.',
    ),
  },
  {
    question: text(
      'Machu Picchu was built by which civilization?',
      'මාචු පික්චු ඉදි කළ ශිෂ්ටාචාරය කුමක්ද?',
    ),
    options: [
      text('Ancient Egyptian', 'පුරාණ ඊජිප්තු'),
      text('Roman', 'රෝම'),
      text('Inca', 'ඉන්කා'),
      text('Khmer', 'ඛමර්'),
    ],
    correct: 2,
    explanation: text(
      'The Inca built Machu Picchu high in the Andes of present-day Peru.',
      'ඉන්කා ජනයා වර්තමාන පේරු රටේ ඇන්ඩීස් කඳුකරයේ මාචු පික්චු ඉදි කළහ.',
    ),
  },
]

export function scoreQuiz(answers: readonly (number | null)[]): number {
  return questions.reduce(
    (score, question, index) => score + (answers[index] === question.correct ? 1 : 0),
    0,
  )
}
