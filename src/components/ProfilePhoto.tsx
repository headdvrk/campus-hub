import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Linking, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSettings } from '../context/SettingsContext';
import {
  deleteProfilePhoto, loadProfilePhoto, ProfilePhotoData, saveProfilePhoto,
} from '../utils/profilePhotoStorage';

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export function ProfilePhoto({ userId }: { userId: string }) {
  const { colors, scale } = useSettings();
  const [photo, setPhoto] = useState<ProfilePhotoData | null>(null);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [quality, setQuality] = useState<0.5 | 1>(1);
  const [crop, setCrop] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  // A ref blocks even two presses before React commits a state update.
  const locked = useRef(true);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    loadProfilePhoto(userId)
      .then((value) => { if (alive.current) setPhoto(value); })
      .catch(() => { if (alive.current) setMessage('Сақталған фотоны оқу мүмкін болмады. Қайта таңдаңыз.'); })
      .finally(() => {
        locked.current = false;
        if (alive.current) setBusy(false);
      });
    return () => { alive.current = false; };
  }, [userId]);

  async function choosePhoto(source: 'camera' | 'gallery') {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setMessage('');
    setSettings(false);
    setConfirmDelete(false);
    try {
      if (source === 'camera') {
        if (Platform.OS === 'web') {
          setMessage('Камерамен түсіруді телефондағы Expo Go ішінде тексеріңіз. Браузерде галереядан файл таңдауға болады.');
          return;
        }
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setMessage('Камераға рұқсат берілмеді. Галереядан фото таңдауға болады.');
          setSettings(!permission.canAskAgain);
          return;
        }
      }
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'], allowsEditing: crop, aspect: [1, 1], quality,
        allowsMultipleSelection: false,
      };
      // On web, launch the picker directly from the click without awaiting permission.
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        setMessage('Сурет табылмады. Қайта таңдаңыз.');
        return;
      }
      if (typeof asset.fileSize === 'number' && asset.fileSize > MAX_PHOTO_BYTES) {
        setMessage('Фото көлемі 5 МБ шегінен асады. Бұрынғы фото сақталды.');
        return;
      }
      const next: ProfilePhotoData = {
        uri: asset.uri, width: asset.width, height: asset.height,
        ...(typeof asset.fileSize === 'number' ? { fileSize: asset.fileSize } : {}),
      };
      const saved = await saveProfilePhoto(userId, next, photo);
      if (!alive.current) return;
      setPhoto(saved);
      setMessage(typeof asset.fileSize === 'number'
        ? 'Профиль фотосы жаңарды.'
        : 'Фото жаңарды. Файл көлемі белгісіз, 5 МБ шегін тексеру мүмкін болмады.');
      const size = typeof asset.fileSize === 'number'
        ? (asset.fileSize / 1024).toFixed(1) + ' КБ' : 'көлемі белгісіз';
      setHistory((items) => [
        `quality ${quality}: ${asset.width} × ${asset.height}, ${size}`, ...items,
      ].slice(0, 4));
    } catch (error) {
      console.error('Profile photo:', error);
      if (alive.current) setMessage('Фотоны ашу немесе сақтау мүмкін болмады. Бұрынғы фото сақталды. Қайта көріңіз.');
    } finally {
      locked.current = false;
      if (alive.current) setBusy(false);
    }
  }

  async function removePhoto() {
    if (locked.current || !photo) return;
    locked.current = true;
    setBusy(true);
    try {
      await deleteProfilePhoto(userId, photo);
      if (alive.current) {
        setPhoto(null);
        setConfirmDelete(false);
        setMessage('Профиль фотосы жойылды. Галереядағы түпнұсқа сақталды.');
      }
    } catch {
      if (alive.current) setMessage('Фотоны жою мүмкін болмады. Қайта көріңіз.');
    } finally {
      locked.current = false;
      if (alive.current) setBusy(false);
    }
  }

  function button(title: string, onPress: () => void, destructive = false) {
    return (
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }}
        disabled={busy} onPress={onPress}
        style={[styles.button, { backgroundColor: destructive ? colors.input : colors.accent,
          opacity: busy ? 0.5 : 1 }]}>
        <Text style={{ color: destructive ? colors.danger : colors.onAccent,
          fontSize: scale(15), fontWeight: '600' }}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={{ color: colors.text, fontSize: scale(19), fontWeight: '700' }}>Профиль фотосы</Text>
      {photo ? <Image source={{ uri: photo.uri }} style={styles.photo} resizeMode="cover"
        accessibilityLabel="Таңдалған профиль фотосы"
        onError={() => setMessage('Фото көрсетілмеді. Басқа сурет таңдаңыз.')} />
        : <View style={[styles.photo, styles.placeholder, { backgroundColor: colors.input }]}>
          <Text style={{ color: colors.muted }}>Фото жоқ</Text>
        </View>}
      {photo && <Text style={{ color: colors.muted, fontSize: scale(14) }}>
        {photo.width} × {photo.height} px · {typeof photo.fileSize === 'number'
          ? (photo.fileSize / (1024 * 1024)).toFixed(2) + ' МБ' : 'Көлемі белгісіз'}
      </Text>}
      <View style={styles.row}>
        {button('Фото таңдау', () => { void choosePhoto('gallery'); })}
        {button('Фото түсіру', () => { void choosePhoto('camera'); })}
      </View>
      <View style={styles.row}>
        <Text style={{ color: colors.text, fontSize: scale(14) }}>Шаршы етіп қию</Text>
        <Switch accessibilityLabel="Шаршы етіп қию" value={crop} disabled={busy} onValueChange={setCrop} />
      </View>
      <Text style={{ color: colors.muted, fontSize: scale(14) }}>Сапа: {quality}. Қабылданатын фото: 5 МБ дейін.</Text>
      <View style={styles.row}>
        {button('Сапа 1.0', () => setQuality(1))}
        {button('Сапа 0.5', () => setQuality(0.5))}
      </View>
      {photo && !confirmDelete && button('Фотоны жою', () => setConfirmDelete(true), true)}
      {photo && confirmDelete && <View style={{ gap: 8 }}>
        <Text style={{ color: colors.text }}>Профиль фотосын жоясыз ба?</Text>
        <View style={styles.row}>
          {button('Иә, жою', () => { void removePhoto(); }, true)}
          {button('Бас тарту', () => setConfirmDelete(false))}
        </View>
      </View>}
      {busy && <ActivityIndicator color={colors.primary} accessibilityLabel="Фото өңделуде" />}
      {!!message && <Text accessibilityLiveRegion="polite" style={{ color: colors.text, fontSize: scale(14) }}>{message}</Text>}
      {settings && button('Баптауларды ашу', () => {
        void Linking.openSettings().catch(() => setMessage('Телефон баптауларынан камераға рұқсат беріңіз.'));
      })}
      {history.length > 0 && <View style={{ gap: 4 }}>
        <Text style={{ color: colors.muted, fontSize: scale(14) }}>Сапаны салыстыру (соңғы таңдаулар)</Text>
        {history.map((item, i) => <Text key={i} style={{ color: colors.muted, fontSize: scale(13) }}>{item}</Text>)}
      </View>}
      {Platform.OS === 'web' && <Text style={{ color: colors.muted, fontSize: scale(13) }}>
        Браузерде фото осы экран ашық болғанда сақталады. Тұрақты сақтау мен камераны телефонда тексеріңіз.
      </Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 20, borderWidth: 1, gap: 12 },
  photo: { width: 180, height: 180, borderRadius: 90, alignSelf: 'center' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  button: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
});
