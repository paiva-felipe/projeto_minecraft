// Galeria de modelos da categoria selecionada

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

  // Busca as casas no SQLite
  const loadHouses = () => {
    try {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS construcoes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          categoria_id INTEGER,
          nome TEXT NOT NULL,
          imagem_url TEXT,
          favorito INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
        );
      `);

      // Adiciona a coluna favorito caso o banco já existisse antes
      const columns = db.getAllSync('PRAGMA table_info(construcoes);');

      const hasFavoriteColumn = columns.some(
        (column) => column.name === 'favorito'
      );

      if (!hasFavoriteColumn) {
        db.execSync(
          'ALTER TABLE construcoes ADD COLUMN favorito INTEGER NOT NULL DEFAULT 0;'
        );
      }

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

  // Adiciona ou remove uma casa dos favoritos
  const handleToggleFavorite = (houseId, isFavorite) => {
    try {
      const newFavoriteValue = isFavorite ? 0 : 1;

      db.runSync(
        'UPDATE construcoes SET favorito = ? WHERE id = ?;',
        [newFavoriteValue, houseId]
      );

      loadHouses();
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  // Exclui uma casa
  const handleDeleteHouse = (houseId) => {
    Alert.alert(
      'Excluir Projeto',
      'Tem certeza que deseja apagar esta casa e todos os blocos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            try {
              db.runSync(
                'DELETE FROM construcoes WHERE id = ?;',
                [houseId]
              );

              loadHouses();
            } catch (error) {
              console.error('Erro ao excluir casa:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        Projetos: {categoryName || 'Todos'}
      </Text>

      <FlatList
        data={houses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HouseCard
            title={item.nome}
            imageUri={item.imagem_url}
            category={categoryName}

            // Informa se a casa está favoritada
            isFavorite={item.favorito === 1}

            // Executa quando o usuário toca na estrela
            onToggleFavorite={() =>
              handleToggleFavorite(
                item.id,
                item.favorito === 1
              )
            }

            onView={() =>
              navigation.navigate('HouseDetailScreen', {
                houseId: item.id,
              })
            }

            onEdit={() =>
              navigation.navigate('AddEditHouseScreen', {
                house: item,
              })
            }

            onDelete={() => handleDeleteHouse(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma casa cadastrada neste estilo.
          </Text>
        }
        contentContainerStyle={styles.listContainer}
      />

      <CustomButton
        title="+ Adicionar Modelo"
        variant="primary"
        onPress={() =>
          navigation.navigate('AddEditHouseScreen', {
            categoryId,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },

  headerTitle: {
    fontFamily: 'MinecraftFont',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },

  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },

  listContainer: {
    paddingBottom: 16,
  },
});
