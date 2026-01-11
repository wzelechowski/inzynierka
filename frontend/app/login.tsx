import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/src/theme/colors';

const KEYCLOAK_URL = 'http://keycloak:8443'; 
const REALM = 'pizzeria';
const CLIENT_ID = 'pizzeria-app';

export default function LoginScreen() {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Błąd', 'Wpisz login i hasło');
      return;
    }

    setLoading(true);

    try {
      // Budujemy dane formularza (x-www-form-urlencoded)
      const params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('grant_type', 'password'); // To jest kluczowe dla tego flow
      params.append('username', username);
      params.append('password', password);
      // params.append('scope', 'openid profile'); // Opcjonalnie

      const response = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Access Token:', data.access_token);
        console.log('Refresh Token:', data.refresh_token);
        
        // TODO: Zapisz token w SecureStore (Mobile) lub localStorage (Web)
        // await SecureStore.setItemAsync('user_token', data.access_token);

        Alert.alert('Sukces', 'Zalogowano pomyślnie!');
        router.replace('/tabs/dashboard');
      } else {
        // Obsługa błędu z Keycloak (np. złe hasło)
        Alert.alert('Błąd logowania', data.error_description || 'Nieprawidłowe dane');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Błąd sieci', 'Nie udało się połączyć z serwerem logowania.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.title}>Witaj w Pizzerii! 🍕</Text>
        
        <Text style={styles.label}>Login / Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="np. jan@kowalski.pl"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Hasło</Text>
        <TextInput 
          style={styles.input} 
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Zaloguj się</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
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
    backgroundColor: colors.primary, // Używam twojego koloru
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