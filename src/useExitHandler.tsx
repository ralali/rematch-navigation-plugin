import React from 'react';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
import { navigationRef } from './navigationPlugin';
import { ExitHandlerOptions } from './types';

function useExitHandler(options: ExitHandlerOptions = {}): void {
  const {
    message = 'Press once again to exit',
    duration = 1500,
    handler = () => BackHandler.exitApp()
  } = options;

  const decremental = React.useRef(1);

  React.useEffect(() => {
    function backButton() {
      if (navigationRef) {
        if (Platform.OS === 'android') {
          decremental.current -= 1;

          if (!navigationRef.canGoBack()) {
            if (decremental.current === -1) {
              handler();
            } else {
              ToastAndroid.show(message, duration);
            }

            setTimeout(() => {
              decremental.current += 1;
            }, 1500);

            return decremental.current === 0;
          }

          navigationRef.goBack();
          return true;
        }
      }
    }

    BackHandler.addEventListener('hardwareBackPress', backButton);

    return () => BackHandler.removeEventListener('hardwareBackPress', backButton);
  }, [decremental]);
}

export default useExitHandler;
