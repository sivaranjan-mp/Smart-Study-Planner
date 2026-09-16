import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  SORT_OPTIONS,
} from '../../utils/constants.js';

/**
 * Task Filter and Sorting Bar.
 * Responsibility: Filter and sort dropdowns emitting filter-state changes up to TaskListPage.
 *
 * @param {Object} props
 * @param {string} [props.priority=''] - Selected priority filter
 * @param {string} [props.status=''] - Selected status filter
 * @param {string} [props.sortBy='createdAt'] - Selected sort column
 * @param {string} [props.sortDirection='desc'] - Selected sort direction ('asc' | 'desc')
 * @param {Function} props.onFilterChange - Callback invoked when any filter changes
 * @param {Function} [props.onReset] - Callback invoked to reset filters
 */
export default function TaskFilterBar({
  priority = '',
  status = '',
  sortBy = 'createdAt',
  sortDirection = 'desc',
  onFilterChange,
  onReset,
}) {
  const handlePriorityChange = (e) => {
    onFilterChange?.({
      priority: e.target.value,
      status,
      sortBy,
      sortDirection,
    });
  };

  const handleStatusChange = (e) => {
    onFilterChange?.({
      priority,
      status: e.target.value,
      sortBy,
      sortDirection,
    });
  };

  const handleSortByChange = (e) => {
    onFilterChange?.({
      priority,
      status,
      sortBy: e.target.value,
      sortDirection,
    });
  };

  const toggleSortDirection = () => {
    const nextDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    onFilterChange?.({
      priority,
      status,
      sortBy,
      sortDirection: nextDirection,
    });
  };

  const hasActiveFilters = Boolean(priority || status || (sortBy && sortBy !== 'createdAt') || sortDirection !== 'desc');

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1.5,
        width: '100%',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ flexGrow: 1, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}
      >
        {/* Priority Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
          <InputLabel id="priority-filter-label">Priority</InputLabel>
          <Select
            labelId="priority-filter-label"
            id="priority-filter-select"
            value={priority}
            label="Priority"
            onChange={handlePriorityChange}
            sx={{ backgroundColor: '#ffffff', borderRadius: 2 }}
          >
            <MenuItem value="">All Priorities</MenuItem>
            {PRIORITY_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter-select"
            value={status}
            label="Status"
            onChange={handleStatusChange}
            sx={{ backgroundColor: '#ffffff', borderRadius: 2 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort By Column */}
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <InputLabel id="sort-by-filter-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-filter-label"
            id="sort-by-filter-select"
            value={sortBy}
            label="Sort By"
            onChange={handleSortByChange}
            sx={{ backgroundColor: '#ffffff', borderRadius: 2 }}
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Direction Button */}
        <Tooltip title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'} (Click to switch)`}>
          <IconButton
            size="small"
            onClick={toggleSortDirection}
            sx={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 2,
              p: 0.9,
              color: 'text.primary',
            }}
          >
            {sortDirection === 'asc' ? (
              <ArrowUpwardRoundedIcon fontSize="small" />
            ) : (
              <ArrowDownwardRoundedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Reset Filters CTA */}
      {hasActiveFilters && (
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<FilterAltOffRoundedIcon fontSize="small" />}
          onClick={onReset}
          sx={{
            borderColor: '#cbd5e1',
            color: 'text.secondary',
            textTransform: 'none',
            fontSize: '0.8125rem',
          }}
        >
          Reset Filters
        </Button>
      )}
    </Box>
  );
}
