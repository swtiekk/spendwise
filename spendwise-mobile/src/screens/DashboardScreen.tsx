import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Plus, Camera, Receipt as ReceiptIcon, User as UserIcon } from 'lucide-react-native';

// ... rest of imports
import api from '../api/client';
import { BudgetSummary, Transaction } from '../types';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = ({ navigation }: any) => {
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [summaryRes, transRes] = await Promise.all([
        api.get('/budgets/summary/'),
        api.get('/transactions/')
      ]);
      setSummary(summaryRes.data);
      setRecentTransactions(transRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>SpendWise</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profileCircle}>
              <UserIcon color="#2563eb" size={24} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Budget Card */}
        <TouchableOpacity onPress={() => navigation.navigate('SetBudgetScreen')}>
          <View style={styles.budgetCard}>
            <View>
              <Text style={styles.budgetLabel}>Remaining Balance</Text>
              <Text style={styles.budgetAmount}>₱{summary?.remaining?.toLocaleString() || '0.00'}</Text>
            </View>
            <View style={styles.budgetStats}>
              <View>
                <Text style={styles.statLabel}>Spent</Text>
                <Text style={styles.statValue}>₱{summary?.total_spent?.toLocaleString() || '0.00'}</Text>
              </View>
              <View style={styles.statDivider} />
              <View>
                <Text style={styles.statLabel}>Limit</Text>
                <Text style={styles.statValue}>₱{summary?.income?.toLocaleString() || '0.00'}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Camera')}>
            <Camera color="#2563eb" size={24} />
            <Text style={styles.actionText}>Scan Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AddTransaction')}>
            <Plus color="#2563eb" size={24} />
            <Text style={styles.actionText}>Add Manual</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length > 0 ? (
          recentTransactions.map((item) => (
            <TouchableOpacity key={item.id} style={styles.transactionItem}>
              <View style={styles.itemIcon}>
                <ReceiptIcon color="#2563eb" size={20} />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemStore}>{item.store_branch || 'Manual Entry'}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
              </View>
              <View style={styles.itemPrice}>
                <Text style={styles.itemAmount}>- ₱{parseFloat(item.amount).toLocaleString()}</Text>
                <Text style={styles.itemDate}>{item.transaction_date}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet. Start by scanning a receipt!</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Camera')}
      >
        <Camera color="#fff" size={28} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  date: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  budgetCard: {
    backgroundColor: '#2563eb',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  budgetLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  budgetAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  budgetStats: {
    flexDirection: 'row',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 15,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 30,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionBtn: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    color: '#1e293b',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAll: {
    color: '#2563eb',
    fontWeight: '600',
  },
  transactionItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2563eb',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default DashboardScreen;
