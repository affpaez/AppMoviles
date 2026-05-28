import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./AuthStack";
import MainAppBottomTabs from "./MainAppBottomTabs";
import OrderStatusScreen from '../screens/cart/OrderStatusScreen'
import CheckoutNoCardScreen from '../screens/cart/CheckoutNoCardScreen'
import QRConfirmationScreen from '../screens/cart/QRConfirmationScreen'
import OrdersScreen from '../screens/profile/OrdersScreen'
import CardsScreen from '../screens/profile/CardsScreen'
import EditProfileScreen from '../screens/profile/EditProfileScreen'
import ProductDetailModalScreen from '../screens/cart/ProductDetailModalScreen'

const Stack = createStackNavigator();

export default function MainAppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="MainAppBottomTabs" component={MainAppBottomTabs} />
      <Stack.Screen name="OrderStatusScreen" component={OrderStatusScreen} />
      <Stack.Screen name="CheckoutNoCardScreen" component={CheckoutNoCardScreen} />
      <Stack.Screen name="QRConfirmationScreen" component={QRConfirmationScreen} />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen name="CardsScreen" component={CardsScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="ProductDetailModal" component={ProductDetailModalScreen} options={{ presentation: 'modal', gestureEnabled: true }} />
    </Stack.Navigator>
  );
}
