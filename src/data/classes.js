export const classes = [
  {
    class: 'Nursery',
    subjects: ['English', 'Urdu', 'Math', 'Nazra-e-Quran'],
  },
  {
    class: 'Prep',
    subjects: ['English', 'Urdu', 'Math', 'Nazra-e-Quran', 'General Knowledge'],
  },
  {
    class: 'Class 1',
    subjects: ['English', 'Urdu', 'Math', 'General Knowledge', 'Islamyat'],
  },
  {
    class: 'Class 2',
    subjects: [
      'English',
      'Urdu',
      'Math',
      'General Knowledge',
      'Islamyat',
      'Computer (Part 1)',
      'Computer (Part 2)',
    ],
  },
  {
    class: 'Class 3',
    subjects: [
      'English',
      'Urdu',
      'Math',
      'General Knowledge',
      'Social Study',
      'Islamyat',
      'Computer (Part 1)',
      'Computer (Part 2)',
    ],
  },
  {
    class: 'Class 4',
    subjects: [
      'English',
      'Urdu',
      'Math',
      'General Knowledge',
      'Social Study',
      'Islamyat',
      'Computer (Part 1)',
      'Computer (Part 2)',
    ],
  },
  {
    class: 'Class 5',
    subjects: [
      'English',
      'Urdu',
      'Math',
      'General Knowledge',
      'Social Study',
      'Islamyat',
      'Computer (Part 1)',
      'Computer (Part 2)',
    ],
  },
  {
    class: 'Class 6',
    subjects: [
      'English',
      'Urdu',
      'Math',
      'General Knowledge',
      'Social Study',
      'Islamyat',
      'Computer (Part 1)',
      'Computer (Part 2)',
      'Quran',
    ],
  },
  {
    class: 'Class 7',
    subjects: [
      'English',
      'Urdu',
      'Math',
      'General Knowledge',
      'Social Study',
      'Islamyat',
      'Computer (Part 1)',
      'Computer (Part 2)',
      'Quran',
    ],
  },
  {
    class: 'Class 8',
    subjects: [
      'English',
      'Urdu',
      'Math',
      'General Knowledge',
      'Social Study',
      'Islamyat',
      'Computer (Part 1)',
      'Computer (Part 2)',
      'Quran',
    ],
  },
];

const marksDistribution = {
  subjects: {
    English: {firstMidterm: 50, finalTerm: 100},
    Urdu: {firstMidterm: 50, finalTerm: 100},
    Math: {firstMidterm: 50, finalTerm: 100},
    'Nazra-e-Quran': {firstMidterm: 50, finalTerm: 100},
    'General Knowledge': {firstMidterm: 50, finalTerm: 100},
    Islamyat: {firstMidterm: 50, finalTerm: 100},
    'Computer (Part 1)': {firstMidterm: 35, finalTerm: 70},
    'Computer (Part 2)': {firstMidterm: 15, finalTerm: 30},
    Quran: {firstMidterm: 50, finalTerm: 100},
  },
};

export const data = {
  classes,
  marksDistribution,
};

// console.log(JSON.stringify(data, null, 2));