import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Receipt as ReceiptIcon, Calendar, Filter, ChevronLeft } from 'lucide-react-native';
import api from '../api/client';
import { Transaction } from '../types';

const TransactionListScreen = ({ navigation }: any) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await api.get('/transactions/');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={[styles.itemIcon, item.source === 'ocr' ? styles.ocrIcon : styles.manualIcon]}>
        <ReceiptIcon color={item.source === 'ocr' ? '#2563eb' : '#64748b'} size={20} />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemStore}>{item.store_branch || 'Manual Entry'}</Text>
        <Text style={styles.itemCategory}>{item.category.replace('_', ' ')}</Text>
      </View>
      <View style={styles.itemPrice}>
        <Text style={styles.itemAmount}>- ₱{parseFloat(item.amount).toLocaleString()}</Text>
        <Text style={styles.itemDate}>{item.transaction_date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No transactions found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
  },
  transactionItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  ocrIcon: {
    backgroundColor: '#eff6ff',
  },
  manualIcon: {
    backgroundColor: '#f1f5f9',
  },
  itemDetails: {
    flex: 1,
  },
  itemStore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  itemCategory: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'capitalize',
  },
  itemPrice: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  itemDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default TransactionListScreen;
