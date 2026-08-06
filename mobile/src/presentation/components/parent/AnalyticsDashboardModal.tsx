import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { AnalyticsSummary } from '../../../domain/entities/Analytics';
import { SQLiteAnalyticsRepository } from '../../../infrastructure/database/SQLiteAnalyticsRepository';

interface AnalyticsDashboardModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({
  visible,
  onClose,
}) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const analyticsRepo = new SQLiteAnalyticsRepository();

  useEffect(() => {
    if (visible) {
      loadAnalytics();
    }
  }, [visible]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await analyticsRepo.getSummary();
      setSummary(data);
    } catch (e) {
      console.error('[AnalyticsDashboardModal] Erro ao carregar dados:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>📊 Relatório de Comunicação & Progresso</Text>
            <Text style={styles.subtitle}>
              Métricas detalhadas para acompanhamento dos pais, fonoaudiólogos e terapeutas.
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 30 }} />
            ) : summary ? (
              <>
                {/* Total de Toques / Comunicações */}
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{summary.totalUsages}</Text>
                  <Text style={styles.statLabel}>Toques / Comunicações Registradas</Text>
                </View>

                {/* Cartões Mais Utilizados */}
                <Text style={styles.sectionTitle}>🏆 Cartões Mais Utilizados</Text>
                {summary.topCards.map((item, index) => {
                  const percentage = Math.round((item.count / summary.totalUsages) * 100) || 0;
                  return (
                    <View key={item.label} style={styles.barContainer}>
                      <View style={styles.barHeader}>
                        <Text style={styles.barLabel}>
                          {index + 1}. {item.label}
                        </Text>
                        <Text style={styles.barCount}>{item.count}x ({percentage}%)</Text>
                      </View>
                      <View style={styles.barBackground}>
                        <View style={[styles.barFill, { width: `${percentage}%` }]} />
                      </View>
                    </View>
                  );
                })}

                {/* Distribuição por Categoria */}
                <Text style={styles.sectionTitle}>📁 Uso por Categoria</Text>
                <View style={styles.categoriesGrid}>
                  {summary.categoryStats.map((cat) => (
                    <View key={cat.categoryName} style={styles.categoryStatCard}>
                      <Text style={styles.categoryStatName}>{cat.categoryName}</Text>
                      <Text style={styles.categoryStatValue}>{cat.count} interações</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Fechar Relatório</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 12,
    marginTop: 10,
  },
  barContainer: {
    marginBottom: 12,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  barCount: {
    fontSize: 13,
    color: '#64748B',
  },
  barBackground: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 5,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryStatCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryStatName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  categoryStatValue: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
