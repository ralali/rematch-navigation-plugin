import React from 'react';
import { navigationRef } from './navigationPlugin';
import { routeSimplifier } from './utils';
import {
  DisposableNavState,
  ScreenAnalytics
} from './types';

function useScreenAnalytics(callback: DisposableNavState): ScreenAnalytics {
  const routeNameRef = React.useRef<string | null>(null);

  // listen state on first open
  React.useEffect(() => {
    if (navigationRef) {
      const navState = navigationRef.getRootState();
      const identicalRoute = routeSimplifier(navState);

      callback(identicalRoute);
    }
  });

  function subscribeState() {
    if (navigationRef && routeNameRef.current) {
      const previousRouteName = routeNameRef.current;
      const currentRouteName = navigationRef.getCurrentRoute()!.name;

      if (previousRouteName !== currentRouteName) {
        const navState = navigationRef.getRootState();
        const identicalRoute = routeSimplifier(navState);

        callback(identicalRoute);
      }

      // Save the current route name for later comparision
      routeNameRef.current = currentRouteName;
    }
  }

  return {
    subscribeState,
    routeNameRef
  };
}

export default useScreenAnalytics;
