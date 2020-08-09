import {
  NavigationContainerRef,
  NavigationState,
  InitialState,
  PartialState,
  Route
} from '@react-navigation/native';

import { MutableRefObject } from 'react';

export {
  NavigationContainerRef,
  NavigationState,
  InitialState,
  PartialState,
  Route
};

export interface IdenticalRoute {
  resultName: string;
  closestRoute: ShortRoute[],
  routes: ShortRoute[]
}

export interface ShortRoute {
  name: string;
  type: string;
}

export type NavigationRoute = Route<string> & {
  state?: NavigationState | PartialState<NavigationState>;
};

export interface ScreenAnalytics {
  subscribeState: () => void;
  routeNameRef: MutableRefObject<string | null>
}

export interface DisposableNavState {
  (navState: IdenticalRoute): void;
}

export interface ExitHandlerOptions {
  message?: string;
  duration?: number;
  handler?: () => void;
}

export interface PersistNavProps {
  storageKey?: string;
}

export interface UsePersistNav {
  isNavReady: boolean;
  initialState: InitialState | undefined;
  setNavState(state: NavigationState | undefined): void;
}

export type ResetState =
  | PartialState<NavigationState>
  | NavigationState
  | (Omit<NavigationState, 'routes'> & {
  routes: Omit<Route<string>, 'key'>[];
});

export type NavigateState =
  | { key: string; params?: Record<string, any> }
  | { name: string; key?: string; params?: Record<string, any> };

export type SetParamsState = Record<string, any>;
