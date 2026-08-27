//Card com a foto da casa, nome, badge da categoria e botões de ação (Visualizar / Editar / Excluir).

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'

export default function HouseCard({ title, imageUri, category, onView, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onView} activeOpacity={0.8}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.category}>{category}</Text>
        </View>
      </TouchableOpacity>
      
      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.button, styles.btnEdit]} onPress={onEdit}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.btnDelete]} onPress={onDelete}>
          <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  btnEdit: {
    backgroundColor: '#f8f9fa',
  },
  btnDelete: {
    backgroundColor: '#ffe6e6',
  },
  btnText: {
    fontWeight: 'bold',
    color: '#333',
  },
});