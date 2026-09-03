import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function BlockItem({ name, imageUri, qtdRequired, qtdPossessed, onQtdChange, onDelete }) {
  const qtdFaltante = qtdRequired - qtdPossessed;
  const isCompleted = qtdFaltante <= 0;

  return (
    <View style={[styles.container, isCompleted && styles.containerCompleted]}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.detail}>Necessário: {qtdRequired}</Text>
        
        <Text style={[styles.detail, isCompleted ? styles.textSuccess : styles.textDanger]}>
          {isCompleted ? 'Concluído!' : `Faltam: ${qtdFaltante}`}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Inventário:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(qtdPossessed)}
          onChangeText={onQtdChange}
        />
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
  },
  containerCompleted: {
    backgroundColor: '#f0fff0',
    borderLeftColor: '#28a745',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  detail: {
    fontSize: 12,
    color: '#666',
  },
  textSuccess: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  textDanger: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  inputContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  label: {
    fontSize: 10,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    width: 50,
    height: 35,
    textAlign: 'center',
    backgroundColor: '#fff',
    marginTop: 4,
    color: '#000',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});