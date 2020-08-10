# @ralali/rematch-navigation-plugin

[![MIT License][license-badge]][license]

React Navigation 5 plugin for Rematch

## Installation
```sh
yarn add @ralali/rematch-navigation-plugin

or

npm i @ralali/rematch-navigation-plugin
```

## Peer Dependencies

- react >= 16.7.0-alpha
- react native ( recommend >= 0.55.0 )
- @react-native-community/async-storage>=1.11.0
- @react-navigation/native >=5.0.0
- @rematch/core >= 1.0.0

## Usage

### `register`

register navigation ref in your root NavigationContainer

```sh
import { register } from '@ralali/rematch-navigation-plugin';
import { NavigationContainer } from '@react-navigation/native';

return (
    <NavigationContainer ref={register} />
);
```

### `navigationPlugin`

```sh
import { init } from '@rematch/core';
import { navigationPlugin } from '@ralali/rematch-navigation-plugin';

const store = init({
  ...,
  plugins: [navigationPlugin]
});

export default store;
```

in your model

```sh
...,
effects: (dispatch) => ({
  exampleNavigate: async () => {
      dispatch.nav.navigate('SomewhereScreen');
  }
});
```

### `navigationRef`

if you want to access NavigationContainer ref, simply use

```sh
import { navigationRef } from '@ralali/rematch-navigation-plugin';
import { CommonActions } from '@react-navigation/native';

function navigateWithoutComponent() {
    if (navigationRef) {
        navigationRef.dispatch(
            CommonActions.navigate({
                name: 'HomeScreen',
                params
            })
        );
    }
}
```

### `useExitHandler`

| options 	| defaultValue                	| ReturnType 	|
|---------	|-----------------------------	|--------------	|
| message 	| Press once again to exit    	| string 	    |
| handler 	| () => BackHandler.exitApp() 	| void   	    |

we already handle for android backPress on root stack if there is no screen left.
Usually if there is screen left in stack navigator, when pressing backPress two times, application will exit

simply put this method in your Root Navigation component

```sh
import { useExitHandler } from '@ralali/rematch-navigation-plugin'

// without custom message
useExitHandler();

// if you want to give custom message
useExitHandler({
    message: 'Becareful, press once again will terminate this app'
});

return (
    <NavigationContainer
    ...
);
```

by default, we use `BackHandler.exitApp()` from `react-native` to handle application exit, hovewer use this function won't totally kill your application

if you want to use another handler for making application totally killed, we suggest to use [react-native-exit-app](https://github.com/wumke/react-native-exit-app)

```sh
import RNExitApp from 'react-native-exit-app';

useExitHandler({
    message: 'Becareful, press once again will terminate this app',
    handler: () => RNExitApp.exitApp()
});
```
 
### `usePersistNav`

This feature is only active in development mode

```sh
import { usePersistNav, register } from '@ralali/rematch-navigation-plugin';

const { initialState, setNavState, isNavReady } = usePersistNav();
  
/**
 * partial docs from https://reactnavigation.org/docs/state-persistence/
 *
 * Because the state is restored asynchronously
 * the app must render an empty/loading view for a moment before we have the initial state
 * to handle this, you can return a loading view when isNavReady is false:
 *
 */
if (!isNavReady) {
    return null;

    or

    return <ActivityIndicator />;
}

return (
    <NavigationContainer
        ref={register}
        initialState={initialState}
        onStateChange={(state) => {
            setNavState(state);
        }}
    >
    ...
);
```

### `useScreenAnalytics`

since screen name on tab can duplicate, different with screne name on stack, this is a useful function to take `IdenticalRoute`

| IdenticalRoute 	| Description                                                                                                                                                                                                                                         	| ReturnType   	|
|----------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|--------------	|
| resultName     	| if the first slice routes type is tab, we will append the type into resultName<br><br>returning latest route name is not enough for us to identify screen activity<br><br>example:<br><br>with tab: [MainTab] - All<br>without tab: CovidInfoScreen 	| string       	|
| closestRoute   	| take the last 2 routes from NavigationState.routes                                                                                                                                                                                                  	| ShortRoute[] 	|
| routes         	| return only name and type from NavigationState.routes                                                                                                                                                                                               	| ShortRoute[] 	|

example usage

```sh
import { useScreenAnalytics, navigationRef } from '@ralali/rematch-navigation-plugin';
import { setCurrentScreen } from 'your/helpers';

const { subscribeState, routeNameRef } = useScreenAnalytics((route) => {
    const { resultName, closestRoute } = route;
    
    // use your analytics function here
    setCurrentScreen(resultName);
});

return (
    <NavigationContainer
        onReady={() => {
            routeNameRef.current = navigationRef.getCurrentRoute().name;
        }}
        onStateChange={(state) => {
            subscribeState();
            setNavState(state);
        }}
    >
    ...
);
```