import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Prosta walidacja po stronie aplikacji
    if (!email || !password || !firstName) {
      Alert.alert('Błąd', 'Wypełnij wszystkie wymagane pola.');
      return;
    }

    setLoading(true);

    try {
      // 2. Wysyłamy dane do TWOJEGO backendu (nie bezpośrednio do Keycloak!)
      // Twój backend użyje Admin API Keycloaka, aby stworzyć usera.
      const response = await fetch('https://twoj-wlasny-backend.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          username: email // Zazwyczaj email jest loginem
        }),
      });

      if (response.ok) {
        Alert.alert(
          'Sukces', 
          'Konto utworzone! Sprawdź email w celu aktywacji lub zaloguj się.',
          [{ text: 'OK', onPress: () => router.back() }] // Wróć do logowania
        );
      } else {
        const errorData = await response.json();
        Alert.alert('Błąd rejestracji', errorData.message || 'Coś poszło nie tak.');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Błąd sieci', 'Brak połączenia z serwerem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formCard}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Nowe konto</Text>
        </View>
        
        <Text style={styles.subTitle}>Dołącz do nas i zamawiaj szybciej!</Text>

        <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
                <Text style={styles.label}>Imię</Text>
                <TextInput 
                  style={styles.input} 
                  value={firstName} onChangeText={setFirstName} 
                  placeholder="Jan"
                />
            </View>
            <View style={{flex: 1, marginLeft: 8}}>
                <Text style={styles.label}>Nazwisko</Text>
                <TextInput 
                  style={styles.input} 
                  value={lastName} onChangeText={setLastName} 
                  placeholder="Kowalski"
                />
            </View>
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          value={email} onChangeText={setEmail} 
          placeholder="jan@kowalski.pl"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Hasło</Text>
        <TextInput 
          style={styles.input} 
          value={password} onChangeText={setPassword} 
          placeholder="Min. 8 znaków"
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Utwórz konto</Text>}
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  backButton: {
      marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subTitle: {
      color: '#666',
      marginBottom: 24,
  },
  row: {
      flexDirection: 'row',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});