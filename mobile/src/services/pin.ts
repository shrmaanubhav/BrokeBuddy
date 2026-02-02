import { sha256 } from 'js-sha256';

export function hashPin(pin: string): string {
  return sha256(pin);
}
