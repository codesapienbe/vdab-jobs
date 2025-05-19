# RecruitmentLoader Component

A fancy preloading animation specifically designed for recruitment and job matching applications. The loader visually represents the process of matching job candidates with positions using animated icons, skill bubbles, and success indicators.

## Features

- Animated profile and job icons that represent candidates and positions
- Flowing skill bubbles that travel from profile to job indicating skill matching
- Success sparkle animations that highlight successful matches
- Gradient connection line between profile and job
- Customizable size and loading text
- Support for light and dark themes using the app's color scheme

## Usage

```tsx
import { RecruitmentLoader } from '../components/RecruitmentLoader';

// Basic usage
<RecruitmentLoader />

// With customizations
<RecruitmentLoader 
  size="large" 
  text="Finding perfect matches..." 
  style={{ marginTop: 20 }}
/>

// Without text (icon animation only)
<RecruitmentLoader showText={false} size="small" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Controls the overall size of the loader |
| `showText` | `boolean` | `true` | Whether to show loading text below the animation |
| `text` | `string` | `'Matching in progress...'` | Custom text to show if `showText` is true |
| `style` | `ViewStyle` | `undefined` | Additional styles to apply to the container |

## Example

Check out the `components/examples/RecruitmentLoaderExample.tsx` file for a complete example of how to use the RecruitmentLoader with different configurations.

## Implementation Details

The loader uses React Native's Animated API and React Native Reanimated to create smooth animations. It also uses Expo's LinearGradient for the connection line between the profile and job icons.

All animations are properly cleaned up when the component unmounts to prevent memory leaks. 