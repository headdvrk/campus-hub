import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { NewsHub } from '../components/NewsHub';

export function FavoritesScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Favorites'>) {
  return <NewsHub initialSection="saved" onBack={() => navigation.goBack()}
    onOpen={announcementId => navigation.navigate('NewsDetails', { announcementId })} />;
}
