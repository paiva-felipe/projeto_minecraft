//Checklist de blocos com input da quantidade possuída e cálculo do saldo faltante

import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

import BlockItem from '../components/BlockItem';
import ProgressBar from '../components/ProgressBar';
import CustomButton from '../components/CustomButton';

const db = SQLite.openDatabaseSync('craftplanner.db');

export default function HouseDetailScreen({ route, navigation }) {
  const { houseId } = route.params;
  const [house, setHouse] = useState(null);
  const [blocks, setBlocks] = useState([]);

  // Busca dados da casa e blocos associados
  const loadHouseDetails = () => {
    try {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS blocos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          construcao_id INTEGER,
          nome_bloco TEXT NOT NULL,
          imagem_bloco TEXT,
          qtd_necessaria INTEGER NOT NULL,
          qtd_possuida INTEGER DEFAULT 0,
          FOREIGN KEY (construcao_id) REFERENCES construcoes(id) ON DELETE CASCADE
        );
      `);

      const houseData = db.getFirstSync('SELECT * FROM construcoes WHERE id = ?;', [houseId]);
      const blockData = db.getAllSync('SELECT * FROM blocos WHERE construcao_id = ?;', [houseId]);

      setHouse(houseData);
      setBlocks(blockData);
    } catch (error) {
      console.error('Erro ao carregar detalhes do projeto:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHouseDetails();
    }, [houseId])
  );

  // UPDATE do CRUD: Atualiza quantidade possuída no SQLite ao digitar
  const handleQtdChange = (blockId, textValue) => {
    const newQtd = parseInt(textValue, 10) || 0;
    try {
      db.runSync('UPDATE blocos SET qtd_possuida = ? WHERE id = ?;', [newQtd, blockId]);
      setBlocks((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, qtd_possuida: newQtd } : b))
      );
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  // DELETE do CRUD para blocos
  const handleDeleteBlock = (blockId) => {
    try {
      db.runSync('DELETE FROM blocos WHERE id = ?;', [blockId]);
      loadHouseDetails();
    } catch (error) {
      console.error('Erro ao remover bloco:', error);
    }
  };

  // Cálculo da porcentagem de progresso geral
  const calculateProgress = () => {
    if (blocks.length === 0) return 0;
    const totalRequired = blocks.reduce((acc, b) => acc + b.qtd_necessaria, 0);
    const totalPossessed = blocks.reduce(
      (acc, b) => acc + Math.min(b.qtd_possuida, b.qtd_necessaria),
      0
    );
    return totalRequired > 0 ? Math.round((totalPossessed / totalRequired) * 100) : 0;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{house ? house.nome : 'Detalhes do Projeto'}</Text>

      <ProgressBar progress={calculateProgress()} />

      <Text style={styles.subtitle}>Lista de Materiais Necessários:</Text>

      <FlatList
        data={blocks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BlockItem
            name={item.nome_bloco}
            imageUri={item.imagem_bloco}
            qtdRequired={item.qtd_necessaria}
            qtdPossessed={item.qtd_possuida}
            onQtdChange={(val) => handleQtdChange(item.id, val)}
            onDelete={() => handleDeleteBlock(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum bloco cadastrado para este projeto.</Text>
        }
        contentContainerStyle={styles.listContainer}
      />

      <CustomButton
        title="+ Adicionar Bloco"
        variant="primary"
        onPress={() => navigation.navigate('AddEditBlockScreen', { houseId })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  title: { fontFamily: 'MinecraftFont', fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#ddd', marginTop: 16, marginBottom: 8 },
  emptyText: { color: '#aaa', textAlign: 'center', marginTop: 20 },
  listContainer: { paddingBottom: 16 },
});