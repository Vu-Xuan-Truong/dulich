import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

const TruncatedText = ({ text, maxLength = 50, style }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => setIsExpanded(!isExpanded);

  return (
    <TouchableOpacity onPress={toggleText}>
      <Text style={style}>
        {isExpanded ? text : `${text.slice(0, maxLength)}${text.length > maxLength ? '...' : ''}`}
        {text.length > maxLength && !isExpanded && (
          <Text style={{ color: 'gray' }}> Xem thêm</Text>
        )}
        {isExpanded && (
          <Text style={{ color: 'gray' }}> Ẩn bớt</Text>
        )}
      </Text>
    </TouchableOpacity>
  );
};

export default TruncatedText;
