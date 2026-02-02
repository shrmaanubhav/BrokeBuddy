import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { hashPin } from '../services/pin';

export default function PinScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const verifyPin = async () => {
    const creds = await Keychain.getGenericPassword();
    if (!creds) return;

    const enteredHash = hashPin(pin);

    if (creds.password === enteredHash) {
      onUnlock();
    } else {
      setError('Wrong PIN');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter PIN</Text>
      <TextInput
        keyboardType="number-pad"
        secureTextEntry
        value={pin}
        onChangeText={setPin}
        maxLength={4}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button title="Unlock" onPress={verifyPin} />
    </View>
  );
}
