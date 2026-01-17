import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Platform, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Slot, useRouter, usePathname, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/constants/colors';
import { useCart } from '@/src/context/CartContext';
import { useAuth } from '@/src/context/AuthContext';
import { Role } from '@/src/types/enums';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { isLoggedIn, logout, user, isLoading } = useAuth();

  // --- ZABEZPIECZENIE (GUARD) ---
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Jeśli użytkownik jest dostawcą, nie powinien widzieć widoku klienta
  if (isLoggedIn && user && user.roles.includes(Role.SUPPLIER)) {
    return <Redirect href="/supplier" />;
  }
  // ------------------------------

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' || pathname === '/index';
    return pathname.includes(path);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navbar}>
          
          <TouchableOpacity onPress={() => navigateTo('/')} style={styles.logoContainer}>
            <Ionicons name="pizza" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.logoText}>Pizzeria</Text>
          </TouchableOpacity>

          <View style={styles.rightContainer}>
            
            <View style={styles.navGroup}>
                <TouchableOpacity 
                  style={[styles.iconButton, isActive('/') && styles.iconButtonActive]} 
                  onPress={() => navigateTo('/')}
                >
                  <Ionicons name="home" size={22} color={isActive('/') ? colors.primary : '#fff'} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.iconButton, isActive('menu') && styles.iconButtonActive]} 
                  onPress={() => navigateTo('/menu')}
                >
                  <Ionicons name="book" size={22} color={isActive('menu') ? colors.primary : '#fff'} />
                </TouchableOpacity>

                {isLoggedIn && (
                  <TouchableOpacity 
                    style={[styles.iconButton, isActive('profile') && styles.iconButtonActive]} 
                    onPress={() => navigateTo('/profile')}
                  >
                    <Ionicons name="person" size={22} color={isActive('profile') ? colors.primary : '#fff'} />
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  onPress={() => router.push('/cart')} 
                  style={[styles.iconButton, { marginLeft: 6 }]}
                >
                  <Ionicons name="cart" size={24} color="#fff" />
                  {totalItems > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{totalItems}</Text>
                    </View>
                  )}
                </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            <View style={styles.authContainer}>
                {isLoggedIn ? (
                  <TouchableOpacity onPress={handleLogout} style={styles.authButton}>
                    <Text style={styles.authText}>Wyloguj</Text>
                    <Ionicons name="log-out-outline" size={18} color="#fff" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => router.push('/login')} style={styles.authButton}>
                    <Text style={styles.authText}>Zaloguj</Text>
                    <Ionicons name="log-in-outline" size={18} color="#fff" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                )}
            </View>

          </View>
        </View>
      </SafeAreaView>

      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  navbar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: colors.primary,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    marginLeft: 2,
    position: 'relative', 
  },
  iconButtonActive: {
    backgroundColor: '#fff', 
  },
  separator: {
    width: 1, 
    height: 24, 
    backgroundColor: 'rgba(255,255,255,0.4)', 
    marginHorizontal: 10 
  },
  authContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 8,
  },
  authText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: colors.warning,
    borderRadius: 9,
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