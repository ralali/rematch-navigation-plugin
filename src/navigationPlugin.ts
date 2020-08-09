import { CommonActions, StackActions } from '@react-navigation/native';
import {
  ResetState,
  NavigateState,
  SetParamsState,
  NavigationContainerRef
} from './types';

export let navigationRef: NavigationContainerRef;

export function register(ref: typeof navigationRef): void {
  navigationRef = ref;
}

const navigationPlugin = {
  onStoreCreated(): void {
    // @ts-ignore
    this.dispatch.nav = {};
    // @ts-ignore
    this.dispatch.nav.navigate = (action: NavigateState) => {
      navigationRef.dispatch(CommonActions.navigate(action));
    };
    // @ts-ignore
    this.dispatch.nav.reset = (action: ResetState) => {
      navigationRef.dispatch(CommonActions.reset(action));
    };
    // @ts-ignore
    this.dispatch.nav.goBack = () => {
      navigationRef.dispatch(CommonActions.goBack());
    };
    // @ts-ignore
    this.dispatch.nav.setParams = (action: SetParamsState) => {
      navigationRef.dispatch(CommonActions.setParams(action));
    };
    // @ts-ignore
    this.dispatch.nav.replace = (name: string, params: Record<string, any>) => {
      navigationRef.dispatch(StackActions.replace(name, params));
    };
    // @ts-ignore
    this.dispatch.nav.push = (name: string, params: Record<string, any>) => {
      navigationRef.dispatch(StackActions.push(name, params));
    };
    // @ts-ignore
    this.dispatch.nav.pop = (count: number) => {
      navigationRef.dispatch(StackActions.pop(count));
    };
    // @ts-ignore
    this.dispatch.nav.popToTop = () => {
      navigationRef.dispatch(StackActions.popToTop());
    };
  }
};

// @ts-ignore
export default navigationPlugin;