import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterActivityScreen from '../screens/RegisterActivityScreen';
import ActivityHistoryScreen from '../screens/ActivityHistoryScreen';
import WalletScreen from '../screens/WalletScreen';
import StoreScreen from '../screens/StoreScreen';
import LogoutScreen from '../screens/LogoutScreen';

import BottomNavigation from '../components/BottomNavigation';
import ReferenceActivityScreen from 'screens/ReferenceActivityScreen';

export type TabsParamList = {
  Dashboard: undefined;
  Profile: undefined;
  RegisterActivity: undefined;
  ReferenceActivity: undefined;
  ActivityHistory: undefined;
  Wallet: undefined;
  Store: undefined;
  Logout: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavigation {...props} />}
    >
      {/* All children must be <Tab.Screen> (or <Tab.Group>, <>…</>) */}
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="RegisterActivity" component={RegisterActivityScreen} />
      <Tab.Screen name="ReferenceActivity" component={ReferenceActivityScreen} />
      <Tab.Screen name="ActivityHistory" component={ActivityHistoryScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Logout" component={LogoutScreen} />
    </Tab.Navigator>
  );
}
