import React from 'react';
import { Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { PersistNavProps, UsePersistNav, NavigationState, InitialState } from './types';

const IS_DEV = !__DEV__;

function usePersistNav(options: PersistNavProps = {}): UsePersistNav {
  const {
    storageKey = 'NAVIGATION_STATE'
  } = options;

  const [isNavReady, setIsNavReady] = React.useState(IS_DEV);
  const [initialState, setInitialState] = React.useState<InitialState>();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(storageKey);
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsNavReady(true);
      }
    };

    if (!isNavReady) {
      restoreState();
    }
  }, [isNavReady, storageKey]);

  function setNavState(state: NavigationState) {
    AsyncStorage.setItem(storageKey, JSON.stringify(state));
  }

  return {
    isNavReady,
    initialState,
    setNavState
  };
}

export default usePersistNav;
