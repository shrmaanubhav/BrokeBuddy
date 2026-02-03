import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';

import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import PinScreen from './src/screens/PinScreen';
import SetPinScreen from './src/screens/SetPinScreen';

import { isBiometricEnabled } from './src/services/biometric';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [pinEnabled, setPinEnabled] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [needsPinSetup, setNeedsPinSetup] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    const unsub = auth().onAuthStateChanged(async u => {
      setUser(u);

      if (u) {
        // 🔐 PIN check (safe)
        const pinCreds = await Keychain.getGenericPassword();
        if (pinCreds) {
          setPinEnabled(true);
          setNeedsPinSetup(false);
        } else {
          setPinEnabled(false);
          setNeedsPinSetup(true);
        }

        // ✅ SAFE biometric flag (NO prompt)
        setBiometricEnabled(await isBiometricEnabled());
      } else {
        // logout reset
        setPinEnabled(false);
        setPinVerified(false);
        setNeedsPinSetup(false);
        setBiometricEnabled(false);
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading) return null;

  // 1️⃣ Not logged in
  if (!user) return <AuthScreen />;

  // 2️⃣ Logged in, no PIN yet
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

  // 3️⃣ Locked → PIN (biometric optional)
  if (pinEnabled && !pinVerified) {
    return (
      <PinScreen
        allowBiometric={biometricEnabled}
        onUnlock={() => setPinVerified(true)}
      />
    );
  }

  // 4️⃣ Fully unlocked
  return <HomeScreen />;
}
