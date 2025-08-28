import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native-web';

export default function App() {
  const [tarefa, setTarefa] = useState('');
  const [tarefasSalvas, setTarefasSalvas] = useState([]);

  useEffect(() => {
    async function buscarTarefas() {
      const tarefasGuardadas = await AsyncStorage.getItem('tarefas');
      if (tarefasGuardadas) {
        setTarefasSalvas(JSON.parse(tarefasGuardadas));
      }
    }
    buscarTarefas();
  }, []);

  const salvarTarefa = async () => {
    if (tarefa === '') {
      alert('Digite uma Tarefa!');
      return;
    }
    const novasTarefas = [...tarefasSalvas, tarefa];
    await AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas));
    setTarefasSalvas(novasTarefas);
    setTarefa('');
    alert('Tarefa salva com sucesso!');
  };

  const excluirTarefa = async (index) => {
    const novasTarefas = tarefasSalvas.filter((_, i) => i !== index);
    await AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas));
    setTarefasSalvas(novasTarefas);
    alert('Tarefa excluída!');
  }

  const limparTarefas = async () => {
    await AsyncStorage.removeItem('tarefas');
    setTarefasSalvas([]);
    alert('Todas as tarefas foram excluídas!');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.box}>
        <Text style={styles.titulo}>To-Do List</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa"
          value={tarefa}
          onChangeText={setTarefa}
        />
        <View style={styles.buttinsContainer}>
          <Button 
            title="Salvar Tarefa" 
            onPress={salvarTarefa}
          />
          <Button 
            title="Limpar Tarefas" 
            color="#ee625eff"
            onPress={limparTarefas} 
          />
        </View>
      </View>
      <View style={styles.containerTarefasSalvas}>
        <Text style={styles.titulo}>Tarefas Salvas</Text>
        <FlatList
          style={{ flexGrow: 1 }}
          data={tarefasSalvas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.tarefaContainer}>
              <Text style={styles.tarefaTexto}>{item}</Text>
              <Button 
                title="Excluir"
                color="#ee625eff"
                onPress={() => excluirTarefa(index)}
              />
            </View>
            
          )}
          ListEmptyComponent={<Text style={styles.texto}>Nenhuma tarefa salva.</Text>}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#5885AF',
  },
  buttinsContainer: {
    gap: 10
  },
  box: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#274472'
  },
  texto: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  containerTarefasSalvas: {
    flex: 1,
    marginTop: 40,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  tarefaContainer: {
    backgroundColor: '#d7edf1a6',
    padding: 15,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 10,
  },
});