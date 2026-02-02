import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { hashPin } from '../services/pin';

export default function SetPinScreen({ onDone }: { onDone: () => void }) {
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const savePin = async () => {
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }
    if (pin !== confirm) {
      setError('PINs do not match');
      return;
    }

    const hashed = hashPin(pin);
    await Keychain.setGenericPassword('user', hashed);
    onDone();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Set a 4-digit PIN</Text>

      <TextInput
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={pin}
        onChangeText={setPin}
        placeholder="Enter PIN"
      />

      <TextInput
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Confirm PIN"
      />

      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

      <Button title="Save PIN" onPress={savePin} />
      <Button title="Skip" onPress={onDone} />
    </View>
  );
}
