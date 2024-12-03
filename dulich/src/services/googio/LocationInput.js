import React, { useState,useEffect  } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { locationSuggestions } from '../googio/goongService'; // Import hàm gọi API Goong

const LocationInput = ({ value,onSelectLocation }) => {
  // const [input, setInput] = useState('');
  const [input, setInput] = useState(value || ''); 
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (text) => {
    setInput(text);
    if (text.trim().length > 0) {
      // Gọi API Goong để lấy gợi ý địa điểm
      const results = await locationSuggestions(text);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setInput(suggestion.description);
    setSuggestions([]);
    onSelectLocation(suggestion); // Truyền thông tin địa điểm đã chọn về component cha
  };

  useEffect(() => {
    if (value !== input) {
      setInput(value); // Update input if value prop changes
    }
  }, [value]);


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa điểm"
        value={input}
        onChangeText={handleInputChange}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  suggestionList: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default LocationInput;
