import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { colors } from '../stylevars';
import { Feather } from '@expo/vector-icons';
import { isSignInWithEmailLink, signInWithEmailLink, sendSignInLinkToEmail, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { authentication, db } from '../firebase/firebase-config';
import { getDoc,doc } from 'firebase/firestore';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthProvider';


import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { signOut } = useContext(AuthContext);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '970420223223-8dpfrs1gsqt77aj67s25ogn4lnc9r8oo.apps.googleusercontent.com',
        });
    }, []);

    useEffect(() => {
        const handleDeepLink = async (event) => {
          const url = event.url;
          const { queryParams } = Linking.parse(url);
          const isRegister = queryParams.register === 'true';

          if(isRegister){
            return;
          }
    
          if (isSignInWithEmailLink(authentication, url)) {
            const storedEmail = await AsyncStorage.getItem('emailForSignIn');
            const result = await signInWithEmailLink(authentication, storedEmail, url);
            await AsyncStorage.removeItem('emailForSignIn');
            const userSnap = await getDoc(doc(db,'users',result.user.uid));
            if(!userSnap.exists()){
                await signOut();
                Alert.alert('This account is not found. Either register or try another auth provider.');
                return;
            }

            navigation.navigate('MainScreen');
          }
    
        };
    
        const subscription = Linking.addEventListener('url', handleDeepLink);
    
        (async () => {
          const initialUrl = await Linking.getInitialURL();
          if (initialUrl) {
            handleDeepLink({ url: initialUrl });
          }
        })();
    
        return () => {
          subscription.remove();
        };
      }, []);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const actionCodeSettings = {
                url: 'https://platemates.page.link/tHrB?register=false',
                handleCodeInApp: true,
            };
      
            await sendSignInLinkToEmail(authentication, email, actionCodeSettings);
            await AsyncStorage.setItem('emailForSignIn', email);
            Alert.alert('Email Sent', 'A sign-in link has been sent to your email. Please check your inbox.');
        } catch (error) {
            Alert.alert('Login Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const { data } = userInfo;
            const idToken = data.idToken;
            const googleCredential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(authentication, googleCredential);
            const docSnap = await getDoc(doc(db, 'users', userCredential.user.uid));

            if (!docSnap.exists()) {
              await signOut();
              Alert.alert('This account does not exist. Please go back and register.');
              return;
            }
        
            navigation.navigate('MainScreen');
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // User cancelled the sign-in process
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // Sign-in is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Google Play Services not available or outdated');
            } else {
                Alert.alert('Google Sign-In Error', error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ position: 'absolute', top: 80, left: 20, zIndex: 1 }}
                onPress={() => navigation.navigate('LandingScreen')}
            >
                <Feather name="arrow-left" size={30} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.header}>Log In to your account</Text>
            <View style={styles.buttonContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.dark_grey}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.shadowContainer}>
                    <TouchableOpacity style={styles.LogInButton} onPress={handleLogin} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.black} />
                        ) : (
                            <Text style={styles.LogInText}>Log In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        width: '90%',
                        backgroundColor: colors.dark_grey,
                        height: 1,
                        marginVertical: 20,
                    }}
                />

                <View style={styles.shadowContainer}>
                    <TouchableOpacity
                        style={styles.GoogleButton}
                        onPress={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../assets/Images/Google.png')} style={styles.googleIcon} />
                            <Text style={styles.GoogleText}>Continue with Google</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingTop: 90,
    },
    textInput: {
        color: colors.black,
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 18,
        fontFamily: 'Poppins_400Regular',
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 8,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.black,
        marginVertical: 40,
        alignSelf: 'center',
        fontFamily: 'LibreBaskerville_700Bold',
    },
    LogInButton: {
        fontWeight: 'bold',
        fontFamily: 'Poppins_700Bold',
        backgroundColor: colors.primary,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: 60,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    LogInText: {
        color: colors.black,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins_700Bold',
        marginHorizontal: 10,
    },
    GoogleButton: {
        borderWidth: 1,
        borderColor: colors.black,
        backgroundColor: 'transparent',
        borderRadius: 8,
        marginVerical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        height: 60,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    GoogleText: {
        color: colors.black,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Poppins_700Bold',
        marginHorizontal: 10,
    },
    googleIcon: {
        height: 20,
        width: 20,
        marginRight: 2.5,
        top: 2,
        tintColor: colors.black,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        top: 50,
        bottom: '40%',
        alignSelf: 'center',
    },

    shadowContainer: {
        width: '100%',
        alignItems: 'center',
        borderRadius: 10,
        padding: 2,
    
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.10,
        shadowRadius: 3.84,
    
        elevation: 5,
      },
});

export default LoginScreen;