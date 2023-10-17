import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Modal, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const App = () => {
  const [toDos, setToDos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [timerStatus, setTimerStatus] = useState('stopped');
  const [timerValue, setTimerValue] = useState(1500); // 25 minutos em segundos
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const addTodo = () => {
    setModalVisible(true);
  };

  const editTodo = (index) => {
    const toDoToEdit = toDos[index];
    setEditingIndex(index);
    setTitle(toDoToEdit.title);
    setNote(toDoToEdit.note);
    setModalVisible(true);

    // Inicia o temporizador automaticamente ao abrir o to-do
    setTimerStatus('started');
    setTimerValue(1500);
  };

  const deleteTodo = (index) => {
    const updatedToDos = [...toDos];
    updatedToDos.splice(index, 1);
    setToDos(updatedToDos);
  };

  const saveToDo = () => {
    if (editingIndex !== -1) {
      const updatedToDos = [...toDos];
      updatedToDos[editingIndex] = { title, note };
      setToDos(updatedToDos);
      setEditingIndex(-1);
    } else {
      const newToDo = { title, note };
      setToDos([...toDos, newToDo]);
    }
    setModalVisible(false);
    setTitle('');
    setNote('');
  };

  const startTimer = () => {
    setTimerStatus('started');
  };

  const stopTimer = () => {
    setTimerStatus('stopped');
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingIndex(-1);
    setTitle('');
    setNote('');
  };

  useEffect(() => {
    if (timerStatus === 'started') {
      if (timerValue === 0) {
        setTimerStatus('stopped');
      } else {
        const interval = setInterval(() => {
          setTimerValue(timerValue - 1);
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [timerStatus, timerValue]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <Button title="Add To-Do" onPress={addTodo} />
      <FlatList
        data={toDos}
        renderItem={({ item, index }) => (
          <View style={styles.toDoItem}>
            <View>
              <Text style={styles.toDoTitle}>{item.title}</Text>
              <Text>{item.note}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons
                name="create-outline"
                size={24}
                color="blue"
                onPress={() => editTodo(index)}
              />
              <Ionicons
                name="trash-bin-outline"
                size={24}
                color="red"
                onPress={() => deleteTodo(index)}
              />
            </View>
          </View>
        )}
      />
      <View style={styles.timerContainer}>
        {timerStatus === 'stopped' ? (
          <Button title="Start Timer" onPress={startTimer} />
        ) : (
          <Button title="Stop Timer" onPress={stopTimer} />
        )}
        <Text style={styles.timer}>
          {`${Math.floor(timerValue / 60)}:${timerValue % 60 < 10 ? '0' : ''}${timerValue % 60}`}
        </Text>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add/Edit To-Do</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={note}
            onChangeText={(text) => setNote(text)}
          />
          <Button title="Save" onPress={saveToDo} />
          <Button title="Cancel" onPress={handleCloseModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  toDoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toDoTitle: {
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  timerContainer: {
    marginTop: 20,
  },
  timer: {
    fontSize: 36,
  },
});

export default App;
