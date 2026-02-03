// src/services/biometric.ts
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_SERVICE = 'biometric';
const BIOMETRIC_FLAG = 'biometric_enabled';

export async function enableBiometric() {
  // biometric-protected secret
  await Keychain.setGenericPassword(
    'biometric',
    'enabled',
    {
      service: BIOMETRIC_SERVICE,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
    }
  );

  // plain flag (NO prompt ever)
  await AsyncStorage.setItem(BIOMETRIC_FLAG, 'true');
}

export async function isBiometricEnabled(): Promise<boolean> {
  return (await AsyncStorage.getItem(BIOMETRIC_FLAG)) === 'true';
}

export async function biometricUnlock(): Promise<boolean> {
  try {
    const creds = await Keychain.getGenericPassword({
      service: BIOMETRIC_SERVICE,
      authenticationPrompt: {
        title: 'Unlock BrokeBuddy',
      },
    });
    return !!creds;
  } catch {
    return false;
  }
}

export async function disableBiometric() {
  await Keychain.resetGenericPassword({ service: BIOMETRIC_SERVICE });
  await AsyncStorage.removeItem(BIOMETRIC_FLAG);
}
