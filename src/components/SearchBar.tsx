import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar...',
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    if (onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder={placeholder}
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSubmit}
        placeholderTextColor="#9ca3af"
        style={styles.input}
        returnKeyType="search"
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 9999,
    paddingVertical: 10,
    paddingLeft: 40,
    paddingRight: 16,
  },
  icon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    marginTop: -9,
  },
  input: {
    fontSize: 14,
    color: '#111827',
  },
});

