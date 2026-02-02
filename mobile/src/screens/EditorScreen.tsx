/**
 * Editor Screen - Полноценный touch-first редактор для мобильных устройств
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';

export const EditorScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { id, name } = route.params;
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'hero', content: { title: 'Welcome' } },
    { id: '2', type: 'text', content: { text: 'Start editing your project...' } }
  ]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.editorArea}>
        {blocks.map((block) => (
          <TouchableOpacity key={block.id} style={styles.blockWrapper}>
            <Text style={styles.blockType}>{block.type.toUpperCase()}</Text>
            <TextInput 
              style={styles.input} 
              defaultValue={block.content.title || block.content.text}
              multiline
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolButton}>
          <Text style={styles.toolText}>+ Блок</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Text style={styles.toolText}>Стиль</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolButton, styles.saveButton]}>
          <Text style={styles.saveText}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  editorArea: { flex: 1, padding: 16 },
  blockWrapper: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  blockType: { fontSize: 10, color: '#64748b', fontWeight: 'bold', marginBottom: 8 },
  input: { fontSize: 16, color: '#1e293b' },
  toolbar: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 12, 
    borderTopWidth: 1, 
    borderColor: '#e2e8f0',
    justifyContent: 'space-around'
  },
  toolButton: { padding: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#f8fafc' },
  toolText: { color: '#475569', fontWeight: '600' },
  saveButton: { backgroundColor: '#4f46e5' },
  saveText: { color: '#fff', fontWeight: 'bold' }
});

