import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  ScrollView, 
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { AuthService } from '@/src/service/authService';

export default function RegisterScreen() {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      const errorMsg = 'Wypełnij wszystkie wymagane pola.';
      if (Platform.OS === 'web') {
        window.alert(errorMsg);
      } else {
        Alert.alert('Błąd', errorMsg);
      }
      return;
    }

    setLoading(true);

    try {
      await AuthService.register({
        firstName,
        lastName,
        email,
        phoneNumber,
        password
      });

      const successTitle = 'Sukces';
      const successMsg = 'Konto zostało utworzone! Sprawdź email w celu aktywacji, a następnie się zaloguj.';

      if (Platform.OS === 'web') {
        window.alert(`${successTitle}\n\n${successMsg}`);
        router.replace('/login');
      } else {
        Alert.alert(
          successTitle, 
          successMsg,
          [
            { 
              text: 'OK', 
              onPress: () => router.replace('/login') 
            }
          ]
        );
      }

    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || 'Wystąpił nieoczekiwany błąd.';
      
      if (Platform.OS === 'web') {
        window.alert(`Błąd rejestracji: ${errorMsg}`);
      } else {
        Alert.alert('Błąd rejestracji', errorMsg);
      }
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

        <Text style={styles.label}>Numer telefonu</Text>
        <TextInput 
          style={styles.input} 
          value={phoneNumber} onChangeText={setPhoneNumber} 
          placeholder="123456789"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Hasło</Text>
        <TextInput 
          style={styles.input} 
          value={password} onChangeText={setPassword} 
          placeholder="Min. 8 znaków"
          secureTextEntry
        />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Masz już konto? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Zaloguj się</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: colors.background,
    padding: 20,
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
  },
  subTitle: {
      color: colors.textSecondary,
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
  
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
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