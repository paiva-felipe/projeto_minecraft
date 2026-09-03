// Modal/Formulário para incluir ou modificar blocos na lista de um projeto

import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, Modal, FlatList, TouchableOpacity, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const db = SQLite.openDatabaseSync('craftplanner.db');

// Lista pré-definida de blocos do Minecraft
const LISTA_DE_BLOCOS = [
  { id: '1', name: 'Concreto Branco', imageUri: 'https://minecraft.wiki/images/White_Concrete.png' },
  { id: '2', name: 'Tábua de Carvalho', imageUri: 'https://minecraft.wiki/images/Oak_Planks.png' },
  { id: '3', name: 'Pedregulho', imageUri: 'https://minecraft.wiki/images/Cobblestone.png' },
  { id: '4', name: 'Bloco de Quartzo', imageUri: 'https://minecraft.wiki/images/Block_of_Quartz.png' },
  { id: '5', name: 'Tábua de Eucalipto', imageUri: 'https://minecraft.wiki/images/Birch_Planks.png' },
  { id: '6', name: 'Tijolos de Pedra', imageUri: 'https://minecraft.wiki/images/Stone_Bricks.png' },
  { id: '7', name: 'Vidro', imageUri: 'https://minecraft.wiki/images/Glass.png' },
  { id: '8', name: 'Tronco de Carvalho', imageUri: 'https://minecraft.wiki/images/Oak_Log.png' },
];

export default function AddEditBlockScreen({ route, navigation }) {
  const { houseId, block } = route.params || {};

  const [name, setName] = useState(block ? block.nome_bloco : '');
  const [imageUri, setImageUri] = useState(block ? block.imagem_bloco : '');
  const [qtdRequired, setQtdRequired] = useState(block ? String(block.qtd_necessaria) : '');
  const [modalVisible, setModalVisible] = useState(false);

  // Seleciona o bloco na lista e já salva o nome + URL da imagem nos estados
  const handleSelectBlock = (selectedItem) => {
    setName(selectedItem.name);
    setImageUri(selectedItem.imageUri);
    setModalVisible(false);
  };

  // CREATE / UPDATE no SQLite
  const handleSave = () => {
    if (!name.trim() || !qtdRequired) {
      Alert.alert('Erro', 'Selecione o bloco e preencha a quantidade necessária.');
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

      {/* SELETOR DE BLOCO (Substitui os antigos campos de Nome e URL) */}
      <Text style={styles.label}>Nome do Bloco</Text>
      <TouchableOpacity 
        style={styles.seletorField} 
        onPress={() => setModalVisible(true)}
      >
        {name ? (
          <View style={styles.selectedRow}>
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.selectedIcon} /> : null}
            <Text style={styles.selectedText}>{name}</Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>Clique para selecionar um bloco...</Text>
        )}
      </TouchableOpacity>

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

      {/* MODAL DE SELEÇÃO */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Escolha um Bloco</Text>
            <FlatList
              data={LISTA_DE_BLOCOS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.optionRow} 
                  onPress={() => handleSelectBlock(item)}
                >
                  <Image source={{ uri: item.imageUri }} style={styles.optionImage} />
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  label: { color: '#ccc', fontSize: 14, marginBottom: 8 },
  seletorField: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
    justifyContent: 'center',
  },
  placeholderText: { color: '#888', fontSize: 16 },
  selectedRow: { flexDirection: 'row', alignItems: 'center' },
  selectedIcon: { width: 24, height: 24, marginRight: 10 },
  selectedText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  buttonContainer: { marginTop: 20, gap: 10 },

  // Estilos do Modal de seleção
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  optionImage: { width: 32, height: 32, marginRight: 12 },
  optionText: { color: '#fff', fontSize: 16 },
});