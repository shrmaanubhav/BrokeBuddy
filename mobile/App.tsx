import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';

import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import PinScreen from './src/screens/PinScreen';
import SetPinScreen from './src/screens/SetPinScreen';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [pinEnabled, setPinEnabled] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [needsPinSetup, setNeedsPinSetup] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async u => {
      setUser(u);

      if (u) {
        const creds = await Keychain.getGenericPassword();

        if (creds) {
          setPinEnabled(true);
          setNeedsPinSetup(false);
        } else {
          setPinEnabled(false);
          setNeedsPinSetup(true);
        }
      } else {
        // reset all local auth state on logout
        setPinEnabled(false);
        setPinVerified(false);
        setNeedsPinSetup(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null; // splash later

  // 1️⃣ Not logged in → OTP
  if (!user) {
    return <AuthScreen />;
  }

  // 2️⃣ Logged in, no PIN yet → ask to set PIN (skippable)
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

  // 3️⃣ PIN exists but not verified → lock app
  if (pinEnabled && !pinVerified) {
    return <PinScreen onUnlock={() => setPinVerified(true)} />;
  }

  // 4️⃣ Fully authenticated & unlocked
  return <HomeScreen />;
}
