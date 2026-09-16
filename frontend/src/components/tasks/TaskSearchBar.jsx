import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import useDebounce from '../../hooks/useDebounce.js';

/**
 * Debounced Task Search Bar.
 * Responsibility: Debounced text input (via useDebounce) searching task name or subject.
 *
 * @param {Object} props
 * @param {string} [props.value=''] - Initial or controlled search term
 * @param {Function} props.onSearch - Callback invoked with debounced search query
 * @param {string} [props.placeholder='Search tasks by name or subject...'] - Placeholder text
 * @param {number} [props.delay=350] - Debounce delay in ms
 * @param {Object} [props.sx] - Additional styles
 */
export default function TaskSearchBar({
  value = '',
  onSearch,
  placeholder = 'Search tasks by name or subject...',
  delay = 350,
  sx,
}) {
  const [searchTerm, setSearchTerm] = useState(value);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // Emit onSearch whenever debounced value changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...sx,
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon color="action" fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search input"
                size="small"
                onClick={handleClear}
                edge="end"
              >
                <ClearRoundedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}
