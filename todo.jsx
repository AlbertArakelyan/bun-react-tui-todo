import React, { useState } from 'react';
import { render, Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState('view'); // 'view' or 'add'

  useInput((input, key) => {
    if (mode === 'view') {
      if (key.upArrow && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
      if (key.downArrow && selectedIndex < todos.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
      if (input === 'a') {
        setMode('add');
        setInputValue('');
      }
      if (input === 'd' && todos.length > 0) {
        setTodos(todos.filter((_, i) => i !== selectedIndex));
        if (selectedIndex >= todos.length - 1) {
          setSelectedIndex(Math.max(0, todos.length - 2));
        }
      }
      if (input === ' ' && todos.length > 0) {
        setTodos(todos.map((todo, i) => 
          i === selectedIndex ? { ...todo, completed: !todo.completed } : todo
        ));
      }
      if (input === 'q') {
        process.exit(0);
      }
    } else if (mode === 'add') {
      if (key.escape) {
        setMode('view');
        setInputValue('');
      }
    }
  });

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { text: inputValue, completed: false }]);
      setInputValue('');
      setMode('view');
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          ✓ Todo List
        </Text>
      </Box>

      {todos.length === 0 && mode === 'view' && (
        <Box marginBottom={1}>
          <Text dimColor>No todos yet. Press 'a' to add one!</Text>
        </Box>
      )}

      {todos.map((todo, i) => (
        <Box key={i} marginBottom={0}>
          <Text color={i === selectedIndex ? 'green' : 'white'}>
            {i === selectedIndex ? '► ' : '  '}
          </Text>
          <Text color={todo.completed ? 'gray' : 'white'}>
            [{todo.completed ? '✓' : ' '}] {todo.completed ? <Text strikethrough>{todo.text}</Text> : todo.text}
          </Text>
        </Box>
      ))}

      {mode === 'add' && (
        <Box marginTop={1} flexDirection="column">
          <Text color="yellow">Add new todo (ESC to cancel):</Text>
          <Box>
            <Text color="cyan">► </Text>
            <TextInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSubmit}
            />
          </Box>
        </Box>
      )}

      <Box marginTop={1} flexDirection="column">
        <Text dimColor>───────────────────────────────</Text>
        <Text dimColor>
          {mode === 'view' ? 
            '[a] Add | [Space] Toggle | [d] Delete | [↑↓] Navigate | [q] Quit' :
            '[Enter] Save | [ESC] Cancel'
          }
        </Text>
      </Box>
    </Box>
  );
};

render(<TodoApp />);