import React, { useState } from 'react';
import { ChildCommunicationScreen } from './src/presentation/screens/ChildCommunicationScreen';
import { ParentSettingsScreen } from './src/presentation/screens/ParentSettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'child' | 'parent'>('child');

  if (currentScreen === 'parent') {
    return <ParentSettingsScreen onBackToChildMode={() => setCurrentScreen('child')} />;
  }

  return <ChildCommunicationScreen onOpenParentSettings={() => setCurrentScreen('parent')} />;
}
