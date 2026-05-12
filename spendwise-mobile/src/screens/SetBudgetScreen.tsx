import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';

const SetBudgetScreen = ({ navigation }: any) => {
  const [income, setIncome] = useState('');
  const [cycle, setCycle] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!income || !startDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    const start = new Date(startDate);
    const end = new Date(startDate);
    if (cycle === 'weekly') end.setDate(start.getDate() + 7);
    else if (cycle === 'biweekly') end.setDate(start.getDate() + 14);
    else end.setMonth(start.getMonth() + 1);

    try {
      const api = require('../api/client').default; // ← lazy require breaks circular dep
      await api.post('/budgets/', {
        income,
        cycle,
        start_date: startDate,
        end_date: end.toISOString().split('T')[0],
      });
      Alert.alert('Success', 'Budget set successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Main') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to set budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.description}>
          Define your income and spending cycle to start tracking your remaining balance.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Income / Budget (₱)</Text>
          <TextInput
            style={styles.input}
            value={income}
            onChangeText={setIncome}
            keyboardType="decimal-pad"
            placeholder="e.g. 50000"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cycle</Text>
          <View style={styles.row}>
            {['weekly', 'biweekly', 'monthly'].map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, cycle === c && styles.activeChip]}
                onPress={() => setCycle(c)}
              >
                <Text style={[styles.chipText, cycle === c && styles.activeChipText]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.disabledBtn]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Set Budget</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 25 },
  description: { fontSize: 14, color: '#64748b', marginBottom: 30, lineHeight: 20 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 15, fontSize: 16 },
  row: { flexDirection: 'row', gap: 10 },
  chip: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  activeChip: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { fontSize: 14, color: '#64748b', textTransform: 'capitalize' },
  activeChipText: { color: '#fff', fontWeight: '600' },
  btn: { backgroundColor: '#2563eb', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  disabledBtn: { backgroundColor: '#94a3b8' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export { SetBudgetScreen };
export default SetBudgetScreen;