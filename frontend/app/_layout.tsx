import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { CartProvider, useCart } from '@/src/context/CartContext';
import { colors } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';

const HeaderCartButton = () => {
  const router = useRouter();
  const { totalItems } = useCart();

  return (
    <TouchableOpacity onPress={() => router.push('/cart')} style={{ marginRight: 15 }}>
      <Ionicons name="cart" size={24} color="#fff" />
      
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const HeaderAuthButton = () => {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const textStyle = { color: '#fff', fontWeight: 'bold' as const, fontSize: 14 };

  if (isLoggedIn) {
    return (
      <TouchableOpacity onPress={logout}>
        <Text style={textStyle}>Wyloguj</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={() => router.push('/login')}>
      <Text style={textStyle}>Zaloguj</Text>
    </TouchableOpacity>
  );
};

export default function RootLayout() {
  return (
    <CartProvider>
      <AuthProvider>
        <MainStack />
      </AuthProvider>
    </CartProvider>
  );
}

function MainStack() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

const renderHeaderRight = () => (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginRight: 15
    }}>
      <HeaderCartButton />
      <HeaderAuthButton />
    </View>
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
        headerRight: renderHeaderRight,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Pizzeria" }} />
      <Stack.Screen name="menu" options={{ title: "Nasze Menu" }} />
      <Stack.Screen name="cart" options={{ title: "Twój Koszyk" }} />
      
      <Stack.Screen name="login" options={{ title: "Logowanie", headerRight: undefined }} />
      <Stack.Screen name="register" options={{ title: "Rejestracja", headerRight: undefined }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: colors.warning,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  }
});