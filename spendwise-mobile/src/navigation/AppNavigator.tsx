import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionListScreen from '../screens/TransactionListScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import SetBudgetScreen from '../screens/SetBudgetScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CameraScreen from '../screens/CameraScreen';
import ReviewReceiptScreen from '../screens/ReviewReceiptScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#1e293b',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={DashboardScreen} 
          options={{ 
            title: 'SpendWise',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen 
          name="Transactions" 
          component={TransactionListScreen} 
          options={{ title: 'All Transactions' }}
        />
        <Stack.Screen 
          name="AddTransaction" 
          component={AddTransactionScreen} 
          options={{ title: 'Manual Entry' }}
        />
        <Stack.Screen 
          name="SetBudget" 
          component={SetBudgetScreen} 
          options={{ title: 'Budget Settings' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'My Profile' }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{ title: 'Scan Receipt' }}
        />
        <Stack.Screen 
          name="ReviewReceipt" 
          component={ReviewReceiptScreen} 
          options={{ title: 'Verify Details' }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
