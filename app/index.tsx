import { useEffect } from 'react';
import { router } from 'expo-router';
import { useUser } from '@/libs/user';

export default function IndexScreen() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.replace('/lobby');
    } else {
      router.replace('/login');
    }
  }, [user]);

  return null;
}
