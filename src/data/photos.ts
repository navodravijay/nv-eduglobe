import type { Localized } from './places'

interface Photo {
  src: string
  alt: Localized
  credit: string
  source: string
  license: string
}
export const photos: Record<string, Photo> = {
  kandy: {
    src: '/assets/kandy.jpg',
    credit: 'Chathura Anuradha Subasinghe',
    source: 'https://unsplash.com/photos/temple-of-the-tooth-with-a-bridge-over-water-isdvqf04MDk',
    license: 'https://unsplash.com/license',
    alt: {
      en: 'The illuminated Temple of the Sacred Tooth Relic beside its moat in Kandy',
      si: 'මහනුවර දිය අගල අසල ආලෝකමත් කළ ශ්‍රී දළදා මාළිගාව',
    },
  },
  galle: {
    src: '/assets/galle.jpg',
    credit: 'Suhas Dissanayake',
    source:
      'https://unsplash.com/photos/white-lighthouse-on-a-grassy-cliff-overlooking-the-ocean-HJkZ9XZ8gPI',
    license: 'https://unsplash.com/license',
    alt: {
      en: 'Galle Fort lighthouse above the palm-lined coast',
      si: 'තල් ගස් සහිත වෙරළ අසල ගාලු කොටුවේ ප්‍රදීපාගාරය',
    },
  },
  ella: {
    src: '/assets/ella.jpg',
    credit: 'Pasan Jayaweera',
    source: 'https://unsplash.com/photos/a-landscape-with-trees-and-hills-ZHREWItgO54',
    license: 'https://unsplash.com/license',
    alt: {
      en: 'Tea fields and forested hills around Ella',
      si: 'ඇල්ල අවට තේ වතු සහ වනාන්තරයෙන් වැසුණු කඳු',
    },
  },
  colombo: {
    src: '/assets/colombo.jpg',
    credit: 'Zoshua Colah',
    source:
      'https://unsplash.com/photos/cityscape-view-with-buildings-and-overcast-sky-TRQ04e-B-yI',
    license: 'https://unsplash.com/license',
    alt: {
      en: 'Colombo streets and high-rise buildings beneath a cloudy sky',
      si: 'වලාකුළු සහිත අහස යට කොළඹ නගරයේ වීදි සහ උස් ගොඩනැගිලි',
    },
  },
  amazon: {
    src: '/assets/amazon.jpg',
    credit: 'Rodrigo Kugnharski',
    source: 'https://unsplash.com/photos/aerial-view-of-houses-on-body-of-water-PAgMQ2088RE',
    license: 'https://unsplash.com/license',
    alt: {
      en: 'Aerial view of Amazon rainforest and riverside floating houses near Tefé, Brazil',
      si: 'බ්‍රසීලයේ ටෙෆේ අසල ඇමසන් වැසි වනාන්තරය සහ ගං ඉවුරේ පාවෙන නිවාසවල ගුවන් දසුන',
    },
  },
  sigiriya: {
    src: '/assets/sigiriya.jpg',
    credit: 'sander traa',
    source: 'https://unsplash.com/photos/a-mountain-with-a-large-rock-on-top-of-it-NTIodyfKMIM',
    license: 'https://unsplash.com/license',
    alt: {
      en: 'Sigiriya rock citadel rising above the surrounding forest',
      si: 'අවට වනාන්තරයට ඉහළින් නැඟෙන සීගිරි ගල් බලකොටුව',
    },
  },
  everest: {
    src: '/assets/everest.jpg',
    credit: 'Mauricio Manzato',
    source:
      'https://unsplash.com/photos/snow-capped-mountain-peak-against-a-clear-blue-sky-dCMSxWkzkbk',
    license: 'https://unsplash.com/license',
    alt: {
      en: 'Snow-covered Mount Everest under a clear blue sky, viewed from Tibet',
      si: 'ටිබෙටයේ සිට පෙනෙන නිල් අහස යට හිමෙන් වැසුණු එවරස්ට් කන්ද',
    },
  },
  giza: {
    src: '/assets/giza.jpg',
    credit: 'Dmitrii Zhodzishskii',
    source: 'https://unsplash.com/photos/the-pyramids-of-giza-are-in-the-desert-aQ7cuVC1VmQ',
    license: 'https://unsplash.com/license',
    alt: {
      en: 'The pyramids of Khufu, Khafre and Menkaure in the desert at Giza',
      si: 'ගීසා කාන්තාරයේ කුෆු, කෆ්රේ සහ මෙන්කෞරේ පිරමීඩ',
    },
  },
  'great-barrier-reef': {
    src: '/assets/reef.jpg',
    credit: 'GeoNadir',
    source: 'https://unsplash.com/photos/an-aerial-view-of-a-coral-reef-in-the-ocean-k4XDVl-JCpQ',
    license: 'https://unsplash.com/license',
    alt: {
      en: 'Aerial view of Yanooa Reef, part of the Great Barrier Reef system',
      si: 'මහා බාධක පර පද්ධතියේ යනූවා පරයේ ගුවන් දසුනක්',
    },
  },
  'machu-picchu': {
    src: '/assets/machu-picchu.jpg',
    credit: 'Natalie Pedigo',
    source: 'https://unsplash.com/photos/machu-picchu-UoKfSYSq0Rk',
    license: 'https://unsplash.com/license',
    alt: {
      en: 'The stone terraces of Machu Picchu surrounded by Andean mountains',
      si: 'ඇන්ඩීස් කඳු වට කළ මාචු පික්චු ගල් හෙල්මළු',
    },
  },
}
