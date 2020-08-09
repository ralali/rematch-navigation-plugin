import {
  NavigationState,
  NavigationRoute,
  IdenticalRoute,
  ShortRoute
} from './types';

function getIdenticalRoute(routes: ShortRoute[]): IdenticalRoute {
  /**
   * take the last 2 routes, since we want to track the closest route
   * react navigation 5 exactly needs Stack / Tab Navigator
   * all routes is wrapped by Stack / Stack Navigator, and return its screen
   * 2 routes will define which stack/tab & child (we called screen)
   * and if the first slice routes type is tab, we will append the type into resultName
   * the problem is returning latest route name is not enough for us to identify screen activity
   * since screen name on tab can duplicate, different with screne name on stack
   * so append tab name will be more declarative to track screen activity
   */
  const closestRoute = routes.slice(-2);

  const insideType = closestRoute[0].type;
  const inside: string = closestRoute[0].name;
  const outside: string = closestRoute[1].name;

  const resultName = insideType === 'tab'
      ? `[${inside}] ${outside}`
      : outside;

  return {
    resultName,
    closestRoute,
    routes
  };
}

export function routeSimplifier(
    navState: NavigationState
): IdenticalRoute {
  try {
    const arrRoute: ShortRoute[] = [];

    const routeLoop = (deepNavState: NavigationState) => {
      const { routes, index } = deepNavState;

      const route: NavigationRoute = routes[index];

      const { state, name } = route;

      const routeType = state?.type || 'screen';

      arrRoute.push({
        name,
        type: routeType
      });

      if (state) {
        routeLoop(state as NavigationState);
      }
    };

    routeLoop(navState);

    return getIdenticalRoute(arrRoute);
  } catch (e) {
    throw new Error(e);
  }
}
