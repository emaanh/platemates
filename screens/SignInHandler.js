import React, { useContext, useEffect } from 'react';
import { AuthContext } from './path_to_your_AuthProvider';
import { Linking, Alert } from 'react-native';

const SignInHandler = () => {
  const { sendSignInLink } = useContext(AuthContext);

  useEffect(() => {
    const handleDeepLink = async (event) => {
      const emailLink = event.url;

      if (authentication.isSignInWithEmailLink(emailLink)) {
        try {
          await sendSignInLink(emailLink);
          Alert.alert('Success', 'You have been signed in!');
        } catch (error) {
          Alert.alert('Error', error.message);
        }
      }
    };

    const linkingListener = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      linkingListener.remove();
    };
  }, [sendSignInLink]);

  return null; // This component doesn't render anything
};

export default SignInHandler;