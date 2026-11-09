import React from 'react';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { NewsHub } from '../components/NewsHub';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'News'>,
  NativeStackScreenProps<RootStackParamList>>;

export function NewsScreen({ navigation }: Props) {
  return <NewsHub onOpen={announcementId => navigation.navigate('NewsDetails', { announcementId })} />;
}
