import { View, Text, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { Slot, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/colors';

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* --- NAVBAR --- */}
        <View style={styles.navbar}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.logoContainer}>
              <Ionicons name="pizza" size={28} color={colors.primary} />
              <Text style={styles.logoText}>PizzaApp</Text>
            </TouchableOpacity>
          </Link>

          <View style={styles.navLinks}>
            {/* 1. MENU */}
            <Link href="/menu" asChild>
              <TouchableOpacity style={styles.navButton}>
                <Text style={styles.navText}>Menu</Text>
              </TouchableOpacity>
            </Link>

            {/* 2. ZAMÓWIENIE / KOSZYK (Nowy element) */}
            <Link href="/order" asChild>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="basket" size={26} color={colors.textPrimary} />
                {/* Opcjonalnie: Licznik produktów (badge) */}
                {/* <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View> */}
              </TouchableOpacity>
            </Link>
            
            {/* 3. LOGOWANIE */}
            <Link href="/login" asChild>
              <TouchableOpacity 
                style={StyleSheet.flatten([styles.navButton, styles.loginButton])}
              >
                <Text style={StyleSheet.flatten([styles.navText, styles.loginText])}>
                  Zaloguj
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={styles.content}>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0, 
  },
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    elevation: 2,
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // Odstęp między elementami nawigacji
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  iconButton: {
    padding: 8,
    position: 'relative', // Potrzebne, jeśli kiedyś dodasz badge z liczbą
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginLeft: 5, // Dodatkowy odstęp od koszyka
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loginText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  // Opcjonalne style dla badge'a (licznika w koszyku)
  /*
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  }
  */
});