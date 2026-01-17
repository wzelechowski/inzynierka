import { Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { CartProvider } from '@/src/context/CartContext';
import { colors } from '@/src/constants/colors';

function MainStack() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
        headerBackTitle: '',
      }}
    >
       <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          title: 'Pizzeria' 
        }} 
      />

     <Stack.Screen 
        name="supplier" 
        options={{ 
          headerShown: false,
          title: 'Supplier' 
        }} 
      />

      <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <CartProvider>
      <AuthProvider>
        <MainStack />
      </AuthProvider>
    </CartProvider>
  );
}