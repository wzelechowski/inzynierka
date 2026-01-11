// app/index.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* 1. SEKCJA HERO */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Głodny?</Text>
        <Text style={styles.heroSubtitle}>Włoska jakość, polska gościnność.</Text>
        <TouchableOpacity 
          style={styles.mainCtaButton}
          onPress={() => router.push('/menu')}
        >
          <Text style={styles.ctaText}>Zobacz pełne Menu</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 2. AKTYWNE PROMOCJE (Horyzontalny Scroll) */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gorące Promocje 🔥</Text>
          <Text style={styles.seeAllText}>Zobacz wszystkie</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
          <PromoCard 
            title="-20% na start" 
            desc="Dla nowych klientów" 
            code="START20" 
            color="#FF9800" 
          />
          <PromoCard 
            title="2 w cenie 1" 
            desc="W każdy wtorek" 
            code="WTORKI" 
            color="#E91E63" 
          />
          <PromoCard 
            title="Darmowa Cola" 
            desc="Do zamówień > 50zł" 
            code="COLAFREE" 
            color="#2196F3" 
          />
        </ScrollView>
      </View>

      {/* 3. DLACZEGO WARTO */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Szybko i smacznie</Text>
        <View style={styles.featuresGrid}>
           {/* Tutaj możesz wstawić karty z poprzedniego przykładu */}
           <FeatureItem icon="bicycle" text="Dostawa w 30 min" />
           <FeatureItem icon="flame" text="Piec opalany drewnem" />
           <FeatureItem icon="leaf" text="Świeże składniki" />
        </View>
      </View>

    </ScrollView>
  );
}

// --- Komponent Karty Promocji ---
function PromoCard({ title, desc, code, color }: { title: string, desc: string, code: string, color: string }) {
  return (
    <TouchableOpacity style={[styles.promoCard, { backgroundColor: color }]}>
      <View>
        <Text style={styles.promoTitle}>{title}</Text>
        <Text style={styles.promoDesc}>{desc}</Text>
      </View>
      <View style={styles.codeBadge}>
        <Text style={styles.codeText}>{code}</Text>
      </View>
    </TouchableOpacity>
  );
}

// --- Komponent Cechy ---
function FeatureItem({ icon, text }: { icon: any, text: string }) {
    return (
        <View style={styles.featureItem}>
            <Ionicons name={icon} size={24} color={colors.primary} />
            <Text style={styles.featureText}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // HERO
  heroSection: {
    padding: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    paddingVertical: 40,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    marginTop: 8,
  },
  mainCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 50,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // PROMOCJE
  sectionContainer: {
    marginTop: 24,
    paddingLeft: 20, // Padding tylko z lewej dla scrolla
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20, // Padding z prawej dla nagłówka
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
  promoScroll: {
    paddingRight: 20,
    paddingBottom: 10,
  },
  promoCard: {
    width: 260,
    height: 140,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  promoDesc: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  codeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 12,
  },
  // FEATURES
  featuresGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingRight: 20,
      marginTop: 10,
  },
  featureItem: {
      alignItems: 'center',
      gap: 8,
      flex: 1,
  },
  featureText: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '500',
  }
});