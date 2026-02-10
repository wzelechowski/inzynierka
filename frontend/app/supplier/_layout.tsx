import React from 'react';
import { Redirect, Stack, useRouter } from 'expo-router';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/constants/colors';
import { Role } from '../../src/types/enums';

export default function SupplierLayout() {
  const { user, isLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isLoggedIn || !user || !user.roles.includes(Role.SUPPLIER)) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { 
            backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { 
            fontWeight: 'bold',
            fontSize: 20,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#F7F9FC' }
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          title: 'Panel Dostawcy',
          
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.replace('/')} 
              activeOpacity={0.7}
              style={{ marginLeft: 10 }} 
            >
              <Ionicons name="home-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),

          headerRight: () => (
            <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: 15, 
                marginRight: 10 
            }}>
                
                <TouchableOpacity 
                  onPress={() => router.push('/supplier/history')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="time-outline" size={26} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => router.push('/supplier/pendingDeliveries')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-circle-outline" size={28} color="#fff" />
                </TouchableOpacity>

            </View>
          ),
        }} 
      />

      <Stack.Screen 
        name="pendingDeliveries"
        options={{
          title: 'Zlecenia',
          headerBackTitle: 'Wróć', 
        }} 
      />

      <Stack.Screen 
        name="history"
        options={{
          title: 'Historia',
          headerBackTitle: 'Wróć', 
        }} 
      />
    </Stack>
  );
}