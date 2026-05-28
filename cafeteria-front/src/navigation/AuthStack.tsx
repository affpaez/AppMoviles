import { createStackNavigator } from "@react-navigation/stack";
import AuthInitialScreen from "../screens/auth/AuthInitialScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";

const Stack = createStackNavigator()

export default function AuthStack () {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthInitialScreen" component={AuthInitialScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  )
}
