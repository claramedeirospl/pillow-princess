import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigationStore } from "@/store/navigationStore";
import { useAuthStore } from "@/store/authStore";

// Auth screens
import { LoginScreen } from "@/features/auth/LoginScreen";
import { RegisterScreen } from "@/features/auth/RegisterScreen";

// App screens
import { HomeScreen } from "@/features/home/HomeScreen";
import { ProductsScreen } from "@/features/products/ProductsScreen";
import { ProductDetailScreen } from "@/features/products/ProductDetailScreen";
import { CartScreen } from "@/features/cart/CartScreen";
import { CheckoutScreen } from "@/features/checkout/CheckoutScreen";
import { OrdersListScreen } from "@/features/orders/OrdersListScreen";
import { OrderTrackingScreen } from "@/features/orders/OrderTrackingScreen";
import { ProfileScreen } from "@/features/profile/ProfileScreen";
import { AddAddressScreen } from "@/features/profile/AddAddressScreen";
import { AddPaymentScreen } from "@/features/profile/AddPaymentScreen";
import { AdminScreen } from "@/features/admin/AdminScreen";
import { AdminProductScreen } from "@/features/admin/AdminProductScreen";

// Global UI
import { BottomNav } from "@/components/BottomNav";
import { Toast } from "@/components/Toast";
import { colors } from "@/styles/theme";

export default function App() {
  const screen = useNavigationStore((s) => s.screen);
  const navigate = useNavigationStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  if (!user) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        {screen === "login" ? (
          <LoginScreen onGoRegister={() => navigate("register")} />
        ) : (
          <RegisterScreen onGoLogin={() => navigate("login")} />
        )}
        <Toast />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {screen === "home" && <HomeScreen />}
      {screen === "products" && <ProductsScreen />}
      {screen === "product-detail" && <ProductDetailScreen />}
      {screen === "cart" && <CartScreen />}
      {screen === "checkout" && <CheckoutScreen />}
      {screen === "orders" && <OrdersListScreen />}
      {screen === "order-tracking" && <OrderTrackingScreen />}
      {screen === "profile" && <ProfileScreen />}
      {screen === "add-address" && <AddAddressScreen />}
      {screen === "add-payment" && <AddPaymentScreen />}
      {isAdmin && screen === "admin" && <AdminScreen />}
      {isAdmin && screen === "admin-product" && <AdminProductScreen />}

      <BottomNav />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
});
