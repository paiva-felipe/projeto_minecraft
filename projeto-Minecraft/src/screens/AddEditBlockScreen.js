import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import SeletorBloco from '../components/SeletorBloco';

const db = SQLite.openDatabaseSync('craftplanner.db');

export default function AddEditBlockScreen({ route, navigation }) {
  const { houseId, block } = route.params || {};

  const [name, setName] = useState(block ? block.nome_bloco : '');
  const [imageUri, setImageUri] = useState(block ? block.imagem_bloco : '');
  const [qtdRequired, setQtdRequired] = useState(block ? String(block.qtd_necessaria) : '');

  // Garante a criação da tabela 'blocos' no banco
  useEffect(() => {
    try {
      db.execSync(`
        CREATE TABLE IF NOT EXISTS blocos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          construcao_id INTEGER NOT NULL,
          nome_bloco TEXT NOT NULL,
          imagem_bloco TEXT,
          qtd_necessaria INTEGER NOT NULL,
          qtd_possuida INTEGER DEFAULT 0
        );
      `);
    } catch (error) {
      console.error('Erro ao criar tabela de blocos:', error);
    }
  }, []);

  // Callback chamado quando o usuário escolhe um item no SeletorBloco
  const handleSelectBlock = (selectedItem) => {
    setName(selectedItem.name);
    setImageUri(selectedItem.imageUri);
  };

  // Salva no SQLite
  const handleSave = () => {
    if (!name.trim() || !qtdRequired) {
      Alert.alert('Atenção', 'Selecione um bloco e preencha a quantidade necessária.');
      return;
    }

    const requiredNum = parseInt(qtdRequired, 10) || 1;

    try {
      if (block) {
        db.runSync(
          'UPDATE blocos SET nome_bloco = ?, imagem_bloco = ?, qtd_necessaria = ? WHERE id = ?;',
          [name.trim(), imageUri, requiredNum, block.id]
        );
      } else {
        db.runSync(
          'INSERT INTO blocos (construcao_id, nome_bloco, imagem_bloco, qtd_necessaria, qtd_possuida) VALUES (?, ?, ?, ?, 0);',
          [houseId, name.trim(), imageUri, requiredNum]
        );
      }
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar bloco:', error);
      Alert.alert('Erro', 'Não foi possível salvar o bloco no banco de dados.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{block ? 'Editar Bloco' : 'Adicionar Novo Bloco'}</Text>

      {/* Componente Seletor encapsulado */}
      <SeletorBloco
        blocoSelecionado={{ name, imageUri }}
        onSelect={handleSelectBlock}
      />

      <CustomInput
        label="Quantidade Necessária"
        value={qtdRequired}
        onChangeText={setQtdRequired}
        placeholder="Ex: 128"
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <CustomButton title="Salvar Bloco" variant="primary" onPress={handleSave} />
        <CustomButton title="Cancelar" variant="secondary" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  buttonContainer: { marginTop: 20, gap: 10 },
});