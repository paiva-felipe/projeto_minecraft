//Modal/Formulário para incluir ou modificar blocos na lista de um projeto

import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const db = SQLite.openDatabaseSync('craftplanner.db');

export default function AddEditBlockScreen({ route, navigation }) {
  const { houseId, block } = route.params || {};

  const [name, setName] = useState(block ? block.nome_bloco : '');
  const [imageUri, setImageUri] = useState(block ? block.imagem_bloco : '');
  const [qtdRequired, setQtdRequired] = useState(block ? String(block.qtd_necessaria) : '');

  // CREATE / UPDATE no SQLite
  const handleSave = () => {
    if (!name.trim() || !qtdRequired) {
      Alert.alert('Erro', 'Preencha o nome do bloco e a quantidade necessária.');
      return;
    }

    const requiredNum = parseInt(qtdRequired, 10) || 1;

    try {
      if (block) {
        // UPDATE
        db.runSync(
          'UPDATE blocos SET nome_bloco = ?, imagem_bloco = ?, qtd_necessaria = ? WHERE id = ?;',
          [name, imageUri, requiredNum, block.id]
        );
      } else {
        // CREATE
        db.runSync(
          'INSERT INTO blocos (construcao_id, nome_bloco, imagem_bloco, qtd_necessaria, qtd_possuida) VALUES (?, ?, ?, ?, 0);',
          [houseId, name, imageUri, requiredNum]
        );
      }
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar bloco:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{block ? 'Editar Bloco' : 'Adicionar Novo Bloco'}</Text>

      <CustomInput
        label="Nome do Bloco"
        value={name}
        onChangeText={setName}
        placeholder="Ex: Concreto Branco, Tábua de Carvalho"
      />

      <CustomInput
        label="Quantidade Necessária"
        value={qtdRequired}
        onChangeText={setQtdRequired}
        placeholder="Ex: 128"
        keyboardType="numeric"
      />

      <CustomInput
        label="URL da Imagem do Bloco"
        value={imageUri}
        onChangeText={setImageUri}
        placeholder="https://..."
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
