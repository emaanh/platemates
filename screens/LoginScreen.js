import React, { useLayoutEffect, useEffect, useContext, useState, useRef } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { colors } from '../stylevars';

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <View style={styles.container}>
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

                <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.dark_grey}
                    value={email}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                />

                <View style={styles.shadowContainer}>
                    <TouchableOpacity style={styles.LogInButton} onPress={() => navigation.navigate('MainScreen')} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.black} />
                        ) : (
                            <Text style={styles.LogInText}>Log In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={{width: '90%', backgroundColor: colors.dark_grey, height: 1, marginVertical: 20 }}/>

                <View style={styles.shadowContainer}>
                    <TouchableOpacity style={styles.GoogleButton} /*onPress={handleSubmit*/ disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.black} />
                        ) : (
                            <View style={{flexDirection: 'row'}}>
                                <Image source={require('../assets/Images/Google.png')} style={styles.googleIcon} />
                                <Text style={styles.GoogleText}>Continue with Google</Text>
                            </View>
                        )}
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
        borderWidth: 2,
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
        // borderWidth: 2,
        // borderColor: colors.black,
        backgroundColor: colors.black,
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
        color: colors.white,
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
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
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