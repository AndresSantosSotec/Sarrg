import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
// import Header from '@/components/Header';
// import BottomNavigation from '@/components/BottomNavigation';
import ProductCard from '../components/ProductCard'; // Ajustar path si tenés alias

export default function StoreScreen() {
  const [search, setSearch] = useState('');

  const products = [
    {
      id: '1',
      title: 'Suplementos Vitamínicos',
      price: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500&auto=format&fit=crop',
    },
    {
      id: '2',
      title: 'Gorra Deportiva',
      price: 1400,
      imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=500&auto=format&fit=crop',
    },
    {
      id: '3',
      title: 'Chamarra Deportiva',
      price: 1500,
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=500&auto=format&fit=crop',
    },
    {
      id: '4',
      title: 'Kit Deportivo',
      price: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1518644961665-ed172691aaa1?q=80&w=500&auto=format&fit=crop',
    },
  ];

  const handleProductSelect = (id: string) => {
    Alert.alert('Producto seleccionado', `Has seleccionado el producto #${id}`);
  };

  const handleLogout = () => {
    Alert.alert('Cerrando sesión', 'Has salido de tu cuenta exitosamente');
    // Aquí iría navegación a login o home
  };

  const renderProduct = ({ item }: any) => (
    <ProductCard
      id={item.id}
      title={item.title}
      price={item.price}
      imageUrl={item.imageUrl}
      onPress={() => handleProductSelect(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      {/* <Header title="MI TIENDA FIT" showBackButton showNotifications /> */}

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Buscar productos..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      <View style={styles.filterRow}>
        <View style={styles.filters}>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Filtrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Populares</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.walletRow}>
        <View style={styles.walletBox}>
          <Text style={styles.walletText}>845 FitCoins</Text>
        </View>
        <View style={styles.cart}>
          <Text style={styles.cartIcon}>🛒</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Productos Disponibles</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderProduct}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Checkout | Canjear</Text>
        </TouchableOpacity>
      </View>

      {/* <BottomNavigation /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  searchBox: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    backgroundColor: '#eff6ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  filterText: {
    color: '#2563eb',
    fontSize: 12,
  },
  logout: {
    color: '#ef4444',
    fontSize: 12,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletBox: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  walletText: {
    color: 'white',
    fontWeight: '600',
  },
  cart: {
    position: 'relative',
    padding: 8,
  },
  cartIcon: {
    fontSize: 24,
    color: '#2563eb',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  checkoutContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
