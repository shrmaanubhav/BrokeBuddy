import React from 'react';
import { View, Text, Button , Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';
import { hashPin } from '../services/pin';
import { enableBiometric, disableBiometric } from '../services/biometric';

export default function HomeScreen() {

const enableBio = async () => {
  await enableBiometric();
  Alert.alert('Biometrics enabled');
};

const disableBio = async () => {
  await disableBiometric();
  Alert.alert('Biometrics disabled');
};

// inside setPin()
const setPin = async () => {
  const hashed = hashPin('1234');
  await Keychain.setGenericPassword('user', hashed);
  Alert.alert('PIN set', 'Your test PIN is 1234');
};


  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome to BrokeBuddy</Text>
      <Text>{auth().currentUser?.phoneNumber}</Text>

      <Button title="Set Test PIN" onPress={setPin} />
      <Button title="Enable Biometrics" onPress={enableBio} />
      <Button title="Disable Biometrics" onPress={disableBio} />
      <Button title="Logout" onPress={() => auth().signOut()} />
    </View>
  );
}
