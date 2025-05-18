import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, imageUrl, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity
          style={[styles.favoriteBtn, isFavorite ? styles.favActive : styles.favInactive]}
          onPress={toggleFavorite}
        >
          <Text style={[styles.heart, isFavorite ? styles.heartActive : null]}>
            ♥
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{price} FitCoins</Text>
          <Text style={styles.badge}>Disponible</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
    marginHorizontal: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  imageWrapper: {
    position: 'relative',
    aspectRatio: 1,
    backgroundColor: '#f9fafb',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    borderRadius: 20,
  },
  favActive: {
    backgroundColor: '#ef4444',
  },
  favInactive: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  heart: {
    fontSize: 12,
    color: '#4b5563',
  },
  heartActive: {
    color: '#fff',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  price: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  badge: {
    fontSize: 10,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: '#6b7280',
  },
});
