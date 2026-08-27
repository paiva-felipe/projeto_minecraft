//Galeria de modelos da categoria selecionada com opções de ver, editar ou deletar

import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

import HouseCard from '../components/HouseCard';
import CustomButton from '../components/CustomButton';

const db = SQLite.openDatabaseSync('craftplanner.db');

export default function HouseListScreen({ route, navigation }) {
  const { categoryId, categoryName } = route.params || {};
  const [houses, setHouses] = useState([]);

  // Busca no SQLite as casas da categoria atual
  const loadHouses = () => {
    try {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS construcoes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          categoria_id INTEGER,
          nome TEXT NOT NULL,
          imagem_url TEXT,
          FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
        );
      `);

      const query = categoryId
        ? 'SELECT * FROM construcoes WHERE categoria_id = ?;'
        : 'SELECT * FROM construcoes;';
      const params = categoryId ? [categoryId] : [];

      const result = db.getAllSync(query, params);
      setHouses(result);
    } catch (error) {
      console.error('Erro ao carregar construções:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHouses();
    }, [categoryId])
  );

  // DELETE do CRUD
  const handleDeleteHouse = (houseId) => {
    Alert.alert('Excluir Projeto', 'Tem certeza que deseja apagar esta casa e todos os blocos?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          try {
            db.runSync('DELETE FROM construcoes WHERE id = ?;', [houseId]);
            loadHouses();
          } catch (error) {
            console.error('Erro ao excluir casa:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Projetos: {categoryName || 'Todos'}</Text>

      <FlatList
        data={houses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HouseCard
            title={item.nome}
            imageUri={item.imagem_url}
            category={categoryName}
            onView={() => navigation.navigate('HouseDetailScreen', { houseId: item.id })}
            onEdit={() => navigation.navigate('AddEditHouseScreen', { house: item })}
            onDelete={() => handleDeleteHouse(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma casa cadastrada neste estilo.</Text>
        }
        contentContainerStyle={styles.listContainer}
      />

      <CustomButton
        title="+ Adicionar Modelo"
        variant="primary"
        onPress={() => navigation.navigate('AddEditHouseScreen', { categoryId })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  headerTitle: { fontFamily: 'MinecraftFont', fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  emptyText: { color: '#aaa', textAlign: 'center', marginTop: 30, fontSize: 16 },
  listContainer: { paddingBottom: 16 },
});