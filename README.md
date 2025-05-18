# VDAB Jobs - Unofficial Mobile App

A React Native mobile application that integrates with the VDAB (Flemish Employment and Vocational Training Service) API to provide job search functionality.

## Features

- **Job Search**: Search for vacancies with text queries
- **Filters**: Filter by job domain, location (postal code), and distance
- **Sorting**: Sort results by relevance, date, or distance
- **Vacancy Details**: View complete job details including requirements and application info
- **Similar Vacancies**: Discover similar job opportunities

## Technical Stack

- **React Native**: Core framework
- **Expo SDK 50+**: Development platform 
- **TypeScript**: Type-safe code
- **React Query**: Data fetching and state management
- **Axios**: API client with certificate pinning
- **React Navigation 7.x**: Stack navigation
- **Expo SecureStore**: API key management
- **Expo Router**: File-based routing

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/vdab-jobs.git
cd vdab-jobs
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your API key
```
EXPO_PUBLIC_VDAB_API_KEY=your_api_key_here
EXPO_PUBLIC_VDAB_BASE_URL=https://api.vdab.be/openservices
```

4. Start the development server
```bash
npm start
```

5. Run on device or simulator
```bash
npm run ios
# or
npm run android
```

## Environment Setup

- Set up your API key in the project's `.env` file
- Configure environment variables in the Expo dashboard for production

## Project Structure

```
├── app/                  # Expo Router app directory 
│   ├── (tabs)/           # Tab navigator screens
│   ├── vacancy/          # Vacancy detail screens
│   └── _layout.tsx       # Root layout with providers
├── components/           # Reusable components
├── constants/            # Constants and configuration
├── hooks/                # Custom React hooks
├── services/             # API services and types
│   ├── api/              # API implementations
│   └── types/            # TypeScript interfaces
└── assets/               # Static assets
```

## Build and Deployment

This project uses EAS (Expo Application Services) for builds and deployments.

### Development Build
```bash
eas build --profile development --platform ios
```

### Production Build
```bash
eas build --profile production --platform all
```

### Submit to App Stores
```bash
eas submit --platform ios
eas submit --platform android
```

## API Documentation

This application uses the VDAB Open Services API. For detailed documentation, visit:
[VDAB Developer Portal](https://developer.vdab.be/openservices/product)

## Security Features

- Certificate pinning for API calls
- Secure storage for API keys
- Request rate limiting
- Request validation middleware

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- VDAB for providing the public API
- Expo team for their excellent development platform
