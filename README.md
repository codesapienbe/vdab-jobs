# VDAB Jobs - Mobile Job Search Application

A mobile application that interfaces with VDAB's job search services to help users find employment opportunities in Flanders, Belgium.

## About VDAB

VDAB (Vlaamse Dienst voor Arbeidsbemiddeling en Beroepsopleiding) is the public employment service of Flanders, Belgium. It serves as a crucial intermediary between job seekers and employers, offering:

- Job matching services for unemployed and employed job seekers
- Career guidance and vocational training programs
- Labor market information and insights
- Support for employers with recruitment and workforce development
- Digital platforms for job searching and career development

VDAB maintains one of Belgium's largest job databases, with thousands of vacancies across various industries and skill levels. Through their OpenServices API, they provide access to this data to encourage innovation in employment services.

## Application Features

- **Job Search**: Search for vacancies using keywords, job categories, and locations
- **Advanced Filtering**: Filter results by location, distance, job domains, and more
- **Customizable Sorting**: Order results by relevance, date, or distance
- **Detailed Job Information**: View comprehensive vacancy details including requirements, qualifications, and salary information
- **Similar Job Recommendations**: Discover similar positions based on your interests

## Technical Stack

This application is built using modern mobile development technologies:

- **React Native**: Cross-platform mobile framework
- **TypeScript**: Statically typed JavaScript for improved reliability
- **React Query**: Data synchronization and caching library
- **Axios**: HTTP client for API requests
- **Expo**: Development platform for React Native

## Getting Started

### Prerequisites
- Node.js 16 or newer
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (optional for development)
- VDAB API key (obtain from [VDAB OpenServices](https://www.vdab.be/open-services))

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/vdab-unofficial.git
cd vdab-unofficial
```

2. Install dependencies
```bash
npm install
```

3. Create environment configuration file `.env`
```
EXPO_PUBLIC_VDAB_API_KEY=your_api_key_here
EXPO_PUBLIC_VDAB_BASE_URL=https://api.vdab.be/openservices
```

4. Start the development server
```bash
npm start
```

5. Launch on a device or simulator
```bash
npm run ios
# OR
npm run android
```

## Project Structure

```
├── app/                  # Main application screens and navigation
│   ├── (tabs)/           # Tab-based navigation screens
│   │   ├── search.tsx    # Job search interface
│   │   └── index.tsx     # Home/landing page
│   ├── vacancy/          # Vacancy-related screens
│   │   └── [id].tsx      # Individual vacancy details
│   ├── (authenticated)/  # Screens requiring authentication
│   │   └── job-detail.tsx # Detailed job view for authenticated users
│   └── _layout.tsx       # Navigation and layout configuration
├── components/           # Reusable UI components
├── constants/            # Application constants and configuration
├── contexts/             # React contexts for state management
├── hooks/                # Custom React hooks
│   ├── useVacancies.ts   # Vacancy data fetching and management
│   ├── useJobDomains.ts  # Job category data management
├── services/             # API and data services
│   ├── api/              # API client and endpoints
│   │   ├── api.service.ts      # Core API client
│   │   ├── vacancy.service.ts  # Vacancy-specific endpoints
│   │   └── jobDomain.service.ts # Job category endpoints
│   └── types/            # TypeScript type definitions
└── assets/               # Static assets (images, fonts)
```

## Building for Production

This project uses EAS (Expo Application Services) for building production-ready applications.

### Development Build
```bash
eas build --profile development --platform ios
```

### Production Build
```bash
eas build --profile production --platform all
```

### App Store Submission
```bash
eas submit --platform ios
eas submit --platform android
```

## Security Features

This application implements several security measures:

- **API Authentication**: Secure communication with VDAB services
- **Secure Storage**: Protected storage of sensitive information
- **Rate Limiting**: Prevention of API abuse
- **Request Validation**: Data validation before transmission
- **Certificate Pinning**: Protection against network attacks

## VDAB API Integration

This application interacts with the VDAB OpenServices API, which provides:

- Comprehensive job listings across Flanders
- Job categorization by industry and function
- Location-based search capabilities
- Job detail information including requirements and benefits
- Similar job recommendation functionality

To use the VDAB API, organizations must register for access at the [VDAB Developer Portal](https://www.vdab.be/open-services). The API provides both JSON and XML formats and requires authentication for access.

## Acknowledgments

- VDAB for providing access to their employment data
- The Expo and React Native teams for their excellent development tools
- Contributors who have helped improve this application

---

For issues, feature requests, or contributions, please open an issue on this repository.

