import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./AuthStack";
import MainAppBottomTabs from "./MainAppBottomTabs";
import CheckoutScreen from "../components/cart/CheckoutScreen";
import ProductoDetalleScreen from '../screens/home/ProductoDetalleScreen'
import OrderStatusScreen from '../screens/cart/OrderStatusScreen'
import CheckoutNoCardScreen from '../screens/cart/CheckoutNoCardScreen'
import CheckoutWithCardScreen from '../screens/cart/CheckoutWithCardScreen'
import AddNewCardScreen from '../screens/cart/AddNewCardScreen'
import QRConfirmationScreen from '../screens/cart/QRConfirmationScreen'
import FiltersScreen from '../screens/home/FiltersScreen'

const Stack = createStackNavigator();

export default function MainAppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="MainAppBottomTabs" component={MainAppBottomTabs} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="ProductoDetalleScreen" component={ProductoDetalleScreen} />
      <Stack.Screen name="OrderStatusScreen" component={OrderStatusScreen} />
      <Stack.Screen name="CheckoutNoCardScreen" component={CheckoutNoCardScreen} />
      <Stack.Screen name="CheckoutWithCardScreen" component={CheckoutWithCardScreen} />
      <Stack.Screen name="AddNewCardScreen" component={AddNewCardScreen} />
      <Stack.Screen name="QRConfirmationScreen" component={QRConfirmationScreen} />
      <Stack.Screen name="FiltersScreen" component={FiltersScreen} />
    </Stack.Navigator>
  );
}
