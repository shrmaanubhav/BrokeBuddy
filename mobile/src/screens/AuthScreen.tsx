import React, { useState ,useEffect} from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function App() {

    useEffect(() => {
    console.log('User on app start:', auth().currentUser);
  }, []);

  const [phone, setPhone] = useState('+91');
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');

  const sendOtp = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setConfirm(confirmation);
      console.log('OTP sent');
    } catch (e) {
      console.log('OTP error', e);
    }
  };

  const verifyOtp = async () => {
    try {
      await confirm.confirm(code);
      console.log('OTP verified');
      console.log('User:', auth().currentUser);
    } catch (e) {
      console.log('Invalid code', e);
    }
  };

  if (!confirm) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Enter phone number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+91XXXXXXXXXX"
          keyboardType="phone-pad"
        />
        <Button title="Send OTP" onPress={sendOtp} />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter OTP</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      <Button title="Verify OTP" onPress={verifyOtp} />
    </View>
  );
}
