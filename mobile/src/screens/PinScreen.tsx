import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import * as Keychain from 'react-native-keychain';

import { hashPin } from '../services/pin';
import { biometricUnlock } from '../services/biometric';

export default function PinScreen({
  onUnlock,
  allowBiometric = false,
}: {
  onUnlock: () => void;
  allowBiometric?: boolean;
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const verifyPin = async () => {
    const creds = await Keychain.getGenericPassword();
    if (!creds) return;

    if (creds.password === hashPin(pin)) {
      onUnlock();
    } else {
      setError('Wrong PIN');
    }
  };

  const tryBiometric = async () => {
    const ok = await biometricUnlock();
    if (ok) onUnlock();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter PIN</Text>

      {allowBiometric && (
        <Button
          title="Use fingerprint / face unlock"
          onPress={tryBiometric}
        />
      )}

      <TextInput
        keyboardType="number-pad"
        secureTextEntry
        value={pin}
        onChangeText={setPin}
        maxLength={4}
        style={{ marginVertical: 10 }}
      />

      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

      <Button title="Unlock with PIN" onPress={verifyPin} />
    </View>
  );
}
