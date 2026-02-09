import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';

const API_URL = process.env.API_URL!;

type Props = {
  onComplete: () => void;
};

export default function NameOnboardingScreen({ onComplete }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = name.trim().length > 0;

  const handleContinue = async () => {
    if (!isValid || loading) return;

    setLoading(true);
    setError(null);

    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('Not authenticated');
      }

      const token = await user.getIdToken();

      const res = await fetch(`${API_URL}/users/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to initialize user');
      }

      onComplete();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Something went wrong. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>Enter your name</Text>

      <TextInput
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

      {error && <Text>{error}</Text>}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isValid || loading}
        />
      )}
    </View>
  );
}
