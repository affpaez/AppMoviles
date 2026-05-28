import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./AuthStack";
import MainAppBottomTabs from "./MainAppBottomTabs";
import CheckoutScreen from "../components/cart/CheckoutScreen";
import ProductoDetalleScreen from '../screens/home/ProductoDetalleScreen'
import OrderStatusScreen from '../screens/cart/OrderStatusScreen'

const Stack = createStackNavigator();

export default function MainAppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="MainAppBottomTabs" component={MainAppBottomTabs} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="ProductoDetalleScreen" component={ProductoDetalleScreen} />
      <Stack.Screen name="OrderStatusScreen" component={OrderStatusScreen} />

    </Stack.Navigator>
  );
}
