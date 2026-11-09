import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export type ProfilePhotoData = {
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
};

const folder = FileSystem.documentDirectory
  ? FileSystem.documentDirectory + 'profile-photos/' : null;
const keyFor = (userId: string) => '@campus_hub_photo:' + encodeURIComponent(userId);

// Never delete the original gallery file, only our own local copies.
async function removeCopy(photo: ProfilePhotoData | null) {
  if (folder && photo?.uri.startsWith(folder)) {
    await FileSystem.deleteAsync(photo.uri, { idempotent: true }).catch(() => {});
  }
}

export async function loadProfilePhoto(userId: string): Promise<ProfilePhotoData | null> {
  if (Platform.OS === 'web') return null;
  const raw = await AsyncStorage.getItem(keyFor(userId));
  if (!raw) return null;
  try {
    const photo = JSON.parse(raw) as ProfilePhotoData;
    if (typeof photo.uri === 'string' && folder && photo.uri.startsWith(folder)
      && typeof photo.width === 'number' && typeof photo.height === 'number'
      && (await FileSystem.getInfoAsync(photo.uri)).exists) return photo;
  } catch {
    // A damaged record or a missing file must not break the profile screen.
  }
  await AsyncStorage.removeItem(keyFor(userId));
  return null;
}

export async function saveProfilePhoto(
  userId: string, photo: ProfilePhotoData, previous: ProfilePhotoData | null,
): Promise<ProfilePhotoData> {
  // Blob URLs in a browser are temporary. Native persistence is the optional lab task.
  if (Platform.OS === 'web') return photo;
  if (!folder) throw new Error('Document directory unavailable');
  await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
  const ext = photo.uri.split('?')[0].match(/\.(jpe?g|png|heic|heif|webp)$/i)?.[1] ?? 'jpg';
  const uri = folder + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
  try {
    await FileSystem.copyAsync({ from: photo.uri, to: uri });
    const saved = { ...photo, uri };
    await AsyncStorage.setItem(keyFor(userId), JSON.stringify(saved));
    await removeCopy(previous);
    return saved;
  } catch (error) {
    await removeCopy({ ...photo, uri });
    throw error;
  }
}

export async function deleteProfilePhoto(userId: string, previous: ProfilePhotoData | null) {
  if (Platform.OS === 'web') return;
  await AsyncStorage.removeItem(keyFor(userId));
  await removeCopy(previous);
}
