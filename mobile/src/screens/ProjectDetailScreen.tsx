/**
 * Экран детального просмотра проекта в мобильном приложении
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { api } from '../services/api';

interface ProjectDetailScreenProps {
  route: {
    params: {
      projectId: string;
    };
  };
  navigation: any;
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { projectId } = route.params;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'brand'>('overview');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await api.getProject(projectId);
      setProject(data);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить проект');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.center}>
        <Text>Проект не найден</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{project.brandName || project.name}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Обзор
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pages' && styles.activeTab]}
          onPress={() => setActiveTab('pages')}
        >
          <Text style={[styles.tabText, activeTab === 'pages' && styles.activeTabText]}>
            Страницы
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'brand' && styles.activeTab]}
          onPress={() => setActiveTab('brand')}
        >
          <Text style={[styles.tabText, activeTab === 'brand' && styles.activeTabText]}>
            Бренд
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && (
          <View style={styles.overview}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Ниша</Text>
              <Text style={styles.cardValue}>{project.niche || 'Не указано'}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Стиль</Text>
              <Text style={styles.cardValue}>{project.style || 'Не указано'}</Text>
            </View>
            {project.brandAssets?.logo && (
              <View style={styles.logoContainer}>
                <Image source={{ uri: project.brandAssets.logo }} style={styles.logo} />
              </View>
            )}
            {project.brandAssets?.palette && (
              <View style={styles.paletteContainer}>
                <Text style={styles.sectionTitle}>Цветовая палитра</Text>
                <View style={styles.palette}>
                  {project.brandAssets.palette.map((color: string, index: number) => (
                    <View
                      key={index}
                      style={[styles.colorSwatch, { backgroundColor: color }]}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {activeTab === 'pages' && (
          <View style={styles.pages}>
            {project.pages && project.pages.length > 0 ? (
              project.pages.map((page: any) => (
                <TouchableOpacity key={page.id} style={styles.pageCard}>
                  <Text style={styles.pageTitle}>{page.name || 'Без названия'}</Text>
                  <Text style={styles.pageBlocks}>
                    {page.blocks?.length || 0} блоков
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>Страницы не созданы</Text>
            )}
          </View>
        )}

        {activeTab === 'brand' && (
          <View style={styles.brand}>
            {project.brandAssets && (
              <>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Логотип</Text>
                  {project.brandAssets.logo ? (
                    <Image source={{ uri: project.brandAssets.logo }} style={styles.brandLogo} />
                  ) : (
                    <Text style={styles.emptyText}>Логотип не загружен</Text>
                  )}
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Шрифты</Text>
                  <Text style={styles.cardValue}>
                    {project.brandAssets.fonts?.join(', ') || 'Не указано'}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366F1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#6B7280',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  overview: {
    padding: 16,
  },
  card: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  paletteContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  palette: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatch: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  pages: {
    padding: 16,
  },
  pageCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  pageBlocks: {
    fontSize: 14,
    color: '#6B7280',
  },
  brand: {
    padding: 16,
  },
  brandLogo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
  },
});

