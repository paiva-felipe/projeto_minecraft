import React, { useState } from 'react';
import { View, Text, Image, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Lista de blocos disponíveis para escolha
const LISTA_DE_BLOCOS = [
  { id: '1', name: 'Concreto Branco', imageUri: 'https://minecraft.wiki/images/White_Concrete.png' },
  { id: '2', name: 'Tábua de Carvalho', imageUri: 'https://minecraft.wiki/images/Oak_Planks.png' },
  { id: '3', name: 'Pedregulho', imageUri: 'https://minecraft.wiki/images/Cobblestone.png' },
  { id: '4', name: 'Bloco de Quartzo', imageUri: 'https://minecraft.wiki/images/Block_of_Quartz.png' },
];

export default function SeletorBloco({ blocoSelecionado, onSelect }) {
  const [modalVisible, setModalVisible] = useState(false);

  const selecionar = (item) => {
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Bloco</Text>
      
      <TouchableOpacity style={styles.campoSeletor} onPress={() => setModalVisible(true)}>
        {blocoSelecionado ? (
          <View style={styles.linhaItem}>
            <Image source={{ uri: blocoSelecionado.imageUri }} style={styles.foto} />
            <Text style={styles.textoItem}>{blocoSelecionado.name}</Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>Ex: Concreto Branco, Tábua de Carvalho...</Text>
        )}
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.fundoModal} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.caixaOpcoes}>
            <Text style={styles.tituloModal}>Selecione um Bloco</Text>
            <FlatList
              data={LISTA_DE_BLOCOS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.opcao} onPress={() => selecionar(item)}>
                  <Image source={{ uri: item.imageUri }} style={styles.fotoModal} />
                  <Text style={styles.textoOpcao}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { color: '#aaa', fontSize: 12, marginBottom: 4 },
  campoSeletor: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    height: 48,
  },
  placeholder: { color: '#888' },
  linhaItem: { flexDirection: 'row', alignItems: 'center' },
  foto: { width: 24, height: 24, marginRight: 10 },
  textoItem: { color: '#000', fontWeight: 'bold' },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  caixaOpcoes: {
    backgroundColor: '#222',
    borderRadius: 8,
    maxHeight: 300,
    padding: 16,
  },
  tituloModal: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  fotoModal: { width: 30, height: 30, marginRight: 12 },
  textoOpcao: { color: '#fff', fontSize: 16 },
});