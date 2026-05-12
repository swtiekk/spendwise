import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Check, AlertCircle } from 'lucide-react-native';
import api from '../api/client';
import { Receipt } from '../types';

const ReviewReceiptScreen = ({ route, navigation }: any) => {
  const { receipt } = route.params as { receipt: Receipt };
  const [amount, setAmount] = useState(receipt.extracted_amount || '');
  const [store, setStore] = useState(receipt.extracted_store || '');
  const [date, setDate] = useState(receipt.extracted_date || '');
  const [category, setCategory] = useState(receipt.extracted_category || 'others');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await api.post('/transactions/', {
        amount,
        store_branch: store,
        transaction_date: date,
        category,
        source: 'ocr',
      });
      Alert.alert('Success', 'Transaction saved successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Main') }
      ]);
    } catch (error) {
      console.error('Confirmation failed:', error);
      Alert.alert('Error', 'Failed to save transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Review Data</Text>
        <Text style={styles.subtitle}>ML model extracted these details from your receipt.</Text>
        
        <View style={styles.confidenceBadge}>
          <Check color="#10b981" size={16} />
          <Text style={styles.confidenceText}>
            {Math.round((receipt.ocr_confidence || 0) * 100)}% Confidence
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount (₱)</Text>
          <TextInput
            style={styles.input}
            value={amount.toString()}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Store / Merchant</Text>
          <TextInput
            style={styles.input}
            value={store}
            onChangeText={setStore}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryRow}>
            {['food', 'beverage', 'utilities', 'others'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, category === cat && styles.activeChip]}
                onPress={() => setCategory(cat as any)}
              >
                <Text style={[styles.categoryText, category === cat && styles.activeChipText]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.confirmBtn, loading && styles.disabledBtn]} 
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Confirm & Save</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelBtn} 
          onPress={() => navigation.replace('Main')}
          disabled={loading}
        >
          <Text style={styles.cancelText}>Discard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 25,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 15,
  },
  confidenceText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  form: {
    padding: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  activeChip: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryText: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'capitalize',
  },
  activeChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: '#2563eb',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledBtn: {
    backgroundColor: '#94a3b8',
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelBtn: {
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    color: '#64748b',
    fontSize: 16,
  },
});

export default ReviewReceiptScreen;
