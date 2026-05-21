import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Search, MapPin } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, Patron! 👋</Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color="#10b981" />
            <Text style={styles.locationText}>Udaipur, Rajasthan</Text>
          </View>
        </View>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} 
          style={styles.avatar} 
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#94a3b8" />
        <Text style={styles.searchText}>Search for food, restaurants...</Text>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>50% OFF</Text>
        <Text style={styles.bannerSub}>On your first order</Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>CLAIM NOW</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Categories */}
      <Text style={styles.sectionTitle}>Quick Picks</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {['Pizza', 'Burger', 'Sushi', 'Indian'].map((cat, index) => (
          <View key={index} style={styles.categoryCard}>
            <Text style={styles.categoryText}>{cat}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    color: '#94a3b8',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '700',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  searchText: {
    color: '#94a3b8',
    marginLeft: 12,
    fontWeight: '600',
  },
  banner: {
    backgroundColor: '#10b981',
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  bannerSub: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#10b981',
    fontWeight: '900',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 16,
  },
  categories: {
    marginBottom: 40,
  },
  categoryCard: {
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryText: {
    color: '#fff',
    fontWeight: '700',
  },
});
