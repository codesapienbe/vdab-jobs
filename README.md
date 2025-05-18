# 🚀 VDAB Jobs - The Awesome Job Finder App! 🔍

Hey there, future job hunter! This is a SUPER COOL app that helps you find awesome jobs in Flanders using the VDAB (that's a big organization that helps people find work). Think of it like having a job-hunting superpower in your pocket! 📱✨

## ⭐ What This App Can Do (It's Like Magic!)

- **Find Jobs** 🕵️‍♂️: Type what job you want and BOOM! The app shows you all the coolest options
- **Super Filters** 🧪: Pick exactly where you want to work and how far you want to travel (no more "But Mom, it's too faaaaar!")
- **Sort Stuff** 📊: Want the newest jobs first? Or ones close to home? You got it!
- **See All the Details** 📝: Check out everything about the job without having to ask a million questions
- **Similar Jobs** 👯‍♂️: If you see a job you like, the app shows you more like it (kind of like when YouTube recommends videos)

## 🤖 Technical Superpowers (Fancy Stuff That Makes It Work)

Our app has some AWESOME tech superpowers! It's like the Avengers of coding:

- **React Native** 👾: Makes the app work on both iPhone AND Android (so you won't be the only one in class who can't use it)
- **TypeScript** 🧙‍♂️: This is like spell-checking for code so the app doesn't explode
- **React Query** 🧠: Remembers stuff so you don't have to keep waiting for things to load (sooo slooow)
- **Axios** 🔒: Talks to job websites securely (no bad guys stealing your info!)
- **Expo** 🎮: Makes building the app easier than building LEGO sets!

## 🚦 Getting Started (How to Make This Awesome Thing Work)

### What You Need First
- A computer with Node.js (it's like the engine that makes code go vroom!)
- Expo CLI (a magical tool that helps build apps)
- A phone OR a pretend phone on your computer (called a simulator)

### Setting Everything Up

1. **Clone the project** (fancy way of saying "download it")
```bash
git clone https://github.com/yourusername/vdab-jobs.git
cd vdab-jobs
```

2. **Install all the parts** (like putting together a toy on Christmas morning)
```bash
npm install
```

3. **Make a secret file** called `.env` with your super-secret password (API key)
```
EXPO_PUBLIC_VDAB_API_KEY=your_secret_code_here
EXPO_PUBLIC_VDAB_BASE_URL=https://api.vdab.be/openservices
```

4. **Start the app's engine!** 🏎️
```bash
npm start
```

5. **Put it on your phone or the pretend phone**
```bash
npm run ios
# OR if you like green robot phones better
npm run android
```

## 🗂️ How Everything is Organized (Like Your School Folders)

```
├── app/                  # The main clubhouse where all screens hang out 
│   ├── (tabs)/           # Screens you can tap at the bottom like tabs in your binder
│   │   ├── search.tsx    # The super search page for finding jobs
│   │   └── index.tsx     # The home page (where you first land)
│   ├── vacancy/          # Rooms for each job's details
│   │   └── [id].tsx      # Shows all the cool info about ONE job
│   └── _layout.tsx       # The blueprint that puts everything together
├── components/           # Our LEGO pieces that we use to build screens
│   ├── VacancyListItem   # The little job cards you see in a list
│   ├── SkeletonPlaceholder # Those flashing things when stuff is loading
│   ├── ThemedButton      # Fancy buttons in our app colors
│   ├── GradientButton    # SUPER fancy buttons with rainbowy colors
│   └── ThemedCard        # Pretty containers for information
├── constants/            # Things that NEVER change (like how many minutes in an hour)
│   ├── Colors.ts         # All our awesome colors (like teal green and bright blue!)
│   └── Config.ts         # Secret stuff the app needs to know
├── hooks/                # Special magic tricks our app can do
│   ├── useVacancies.ts   # Gets all the job info from the internet
│   ├── useJobDomains.ts  # Finds what types of jobs exist
│   └── useAppTheme.ts    # Changes colors if it's day or night mode
├── services/             # How we talk to the job database
│   ├── api/              # Our telephone to call VDAB
│   │   ├── api.service.ts      # The main telephone
│   │   ├── vacancy.service.ts  # For calling about jobs
│   │   └── jobDomain.service.ts # For calling about job types
│   └── types/            # Instructions for what job info looks like
├── contexts/             # Special info every part of the app can see
│   └── ThemeContext.tsx  # Tells EVERYTHING what colors to use
└── assets/               # Cool pictures, fonts, and sounds
    ├── images/           # All the pretty pictures
    └── fonts/            # Different text styles
```

Think of our app like a GIANT treehouse with different rooms and secret passages! Each folder is like a room with special tools to do cool things. When they all work together - BOOM! - you get an awesome job hunting app! 🧙‍♂️🔮

## 🏗️ Building the App For Real

This uses something called "EAS" which is like having a robot assistant build your app for you! 🤖

### Make a Version for Testing
```bash
eas build --profile development --platform ios
```

### Make the REAL Version
```bash
eas build --profile production --platform all
```

### Put it in the App Stores (So Your Friends Can Download It)
```bash
eas submit --platform ios
eas submit --platform android
```

## 🔐 Super Secure Stuff

Our app has special protection like:
- **Certificate Pinning** 📌: Makes sure bad websites can't trick the app
- **Secure Storage** 🔑: Keeps your secrets safe like a digital Fort Knox
- **Rate Limiting** 🚦: Stops the app from asking too many questions too fast
- **Request Validation** 🧐: Makes sure the app only asks smart questions

## 👏 Special Thanks

- VDAB for sharing their job info with us
- The Expo team for making cool tools (without them, this would be WAAAY harder)
- YOU for using our app! You're the real MVP! 🏆

---

If you find bugs 🐛 (not real bugs, but when something breaks), let us know! 

