import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  // Redirect to the login screen
  return <Redirect href="/login" />;
} 