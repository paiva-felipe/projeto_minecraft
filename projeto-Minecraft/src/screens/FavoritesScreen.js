//Tela de favoritos 

// Tela que exibe as construções marcadas como favoritas

import React, { useCallback, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

import HouseCard from '../components/HouseCard';

const db = SQLite.openDatabaseSync('craftplanner.db');

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  // Garante que a tabela exista e tenha a coluna favorito
  const prepareDatabase = () => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS construcoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoria_id INTEGER,
        nome TEXT NOT NULL,
        imagem_url TEXT,
        favorito INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (categoria_id)
          REFERENCES categorias(id)
          ON DELETE CASCADE
      );
    `);

    const columns = db.getAllSync(
      'PRAGMA table_info(construcoes);'
    );

    const hasFavoriteColumn = columns.some(
      (column) => column.name === 'favorito'
    );

    if (!hasFavoriteColumn) {
      db.execSync(
        'ALTER TABLE construcoes ADD COLUMN favorito INTEGER NOT NULL DEFAULT 0;'
      );
    }
  };

  // Busca somente as casas favoritedas
  const loadFavorites = () => {
    try {
      prepareDatabase();

      const result = db.getAllSync(`
        SELECT
          construcoes.*,
          categorias.nome AS categoria_nome
        FROM construcoes
        LEFT JOIN categorias
          ON categorias.id = construcoes.categoria_id
        WHERE construcoes.favorito = 1
        ORDER BY construcoes.id DESC;
      `);

      setFavorites(result);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  // Atualiza a lista sempre que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Remove uma casa dos favoritos
  const handleRemoveFavorite = (houseId) => {
    try {
      db.runSync(
        'UPDATE construcoes SET favorito = 0 WHERE id = ?;',
        [houseId]
      );

      loadFavorites();
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  // Exclui completamente a casa
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

              loadFavorites();
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
        Meus Favoritos
      </Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HouseCard
            title={item.nome}
            imageUri={item.imagem_url}
            category={item.categoria_nome || 'Sem categoria'}
            isFavorite={true}
            onToggleFavorite={() =>
              handleRemoveFavorite(item.id)
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
            onDelete={() =>
              handleDeleteHouse(item.id)
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma construção foi adicionada aos favoritos.
          </Text>
        }
        contentContainerStyle={styles.listContainer}
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },

  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    lineHeight: 24,
  },

  listContainer: {
    paddingBottom: 16,
    flexGrow: 1,
  },
});
