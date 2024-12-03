import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { firestore } from '../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'; // Modular imports
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using react-native-vector-icons

const CategoryManagementScreen = () => {
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // Controls visibility of the input field
  const [newCategoryName, setNewCategoryName] = useState('');

  // Fetch categories from Firebase Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      const categoryList = [];
      const querySnapshot = await getDocs(collection(firestore, 'categories'));
      querySnapshot.forEach(doc => {
        categoryList.push({ id: doc.id, ...doc.data() });
      });
      setCategories(categoryList);
    };

    fetchCategories();
  }, []);

  // Add new category to Firestore and update state
  const addCategory = async () => {
    if (newCategoryName.trim()) {
      // Add new category to Firestore
      const newCategoryRef = await addDoc(collection(firestore, 'categories'), {
        name: newCategoryName,
      });

      // Update state to reflect the new category
      const newCategory = {
        id: newCategoryRef.id,
        name: newCategoryName,
      };
      setCategories([...categories, newCategory]); // Add new category to the state array

      setNewCategoryName(''); // Reset input field
      setIsAdding(false); // Hide input field after adding
    }
  };

  // Delete a category from Firestore
  const deleteCategory = async (categoryId) => {
    await deleteDoc(doc(firestore, 'categories', categoryId));
    setCategories(categories.filter(category => category.id !== categoryId)); // Update the state after deletion
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin - Danh mục</Text>
      {/* Category List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteCategory(item.id)}>
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add Category Section */}
      {isAdding && (
        <View style={styles.addCategoryContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên ..."
            value={newCategoryName}
            onChangeText={setNewCategoryName}
          />
          <TouchableOpacity style={styles.addButton} onPress={addCategory}>
            <Text style={styles.addButtonText}>Thêm</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setIsAdding(!isAdding)}>
        <Icon name={isAdding ? "close" : "add"} size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CategoryManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA', // Light background color for a clean look
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryName: {
    fontSize: 16,
    color: '#333', // Darker text for readability
  },
  addCategoryContainer: {
    flexDirection: 'row', // Keep input and button in one row
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff', // White background for input section
    borderRadius: 10,
    padding: 10,
    elevation: 2, // Shadow for better visibility
  },
  input: {
    flex: 1, // Input takes the available space
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  addButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10, // Space between input and button
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80, // Adjusted position to not overlap with the input section
    backgroundColor: '#6200EE',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // Shadow for floating effect
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
