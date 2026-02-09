import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthScreen from './src/screens/AuthScreen';
import NameOnboardingScreen from './src/screens/NameOnboardingScreen';
import SetPinScreen from './src/screens/SetPinScreen';
import PinScreen from './src/screens/PinScreen';
import HomeScreen from './src/screens/HomeScreen';

import { isBiometricEnabled } from './src/services/biometric';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [pinEnabled, setPinEnabled] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [needsPinSetup, setNeedsPinSetup] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    const unsub = auth().onAuthStateChanged(async u => {
      setUser(u);

      if (u) {
        const pinCreds = await Keychain.getGenericPassword();
        if (pinCreds) {
          setPinEnabled(true);
          setNeedsPinSetup(false);
        } else {
          setPinEnabled(false);
          setNeedsPinSetup(true);
        }

        setBiometricEnabled(await isBiometricEnabled());

        const flag = await AsyncStorage.getItem('softOnboardingCompleted');
        setOnboardingDone(flag === 'true');
      } else {
        setPinEnabled(false);
        setPinVerified(false);
        setNeedsPinSetup(false);
        setBiometricEnabled(false);
        setOnboardingDone(false);
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading) return null;

  // 1️⃣ Not logged in
  if (!user) return <AuthScreen />;

  // 2️⃣ Logged in, but name not collected yet
  if (!onboardingDone) {
    return (
      <NameOnboardingScreen
        onComplete={async () => {
          await AsyncStorage.setItem('softOnboardingCompleted', 'true');
          setOnboardingDone(true);
          setPinVerified(false); // safety reset
        }}
      />
    );
  }

  // 3️⃣ Name done, but no PIN yet
  if (needsPinSetup) {
    return (
      <SetPinScreen
        onDone={() => {
          setNeedsPinSetup(false);
          setPinEnabled(true);
        }}
      />
    );
  }

  // 4️⃣ PIN exists but not unlocked
  if (pinEnabled && !pinVerified) {
    return (
      <PinScreen
        allowBiometric={biometricEnabled}
        onUnlock={() => setPinVerified(true)}
      />
    );
  }

  // 5️⃣ Fully ready
  return <HomeScreen />;
}
