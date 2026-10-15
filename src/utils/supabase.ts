import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const isServer = Platform.OS === 'web' && typeof window === 'undefined'

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: {
        getItem: (key: string) => isServer ? Promise.resolve(null) : AsyncStorage.getItem(key),
        setItem: (key: string, value: string) => isServer ? Promise.resolve() : AsyncStorage.setItem(key, value),
        removeItem: (key: string) => isServer ? Promise.resolve() : AsyncStorage.removeItem(key),
      },
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })