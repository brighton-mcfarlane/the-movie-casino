import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, ListItemAvatar } from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';

const PosterImage = styled('img')(({ theme }) => ({
  width: '50px',
  height: '75px',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}));

const SearchResultItemContainer = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SearchResultItem = ({ result, onAdd }) => {
  return (
    <SearchResultItemContainer>
      <ListItemAvatar>
        <PosterImage src={result.Poster} alt={result.Title} />
      </ListItemAvatar>
      <ListItemText
        primary={result.Title}
        secondary={
          <>
            <div>Year: {result.Year}</div>
            <div>Rated: {result.Rated}</div>
            <div>Plot: {result.Plot}</div>
          </>
        }
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="add" onClick={() => onAdd(result)}>
          <AddIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </SearchResultItemContainer>
  );
};

export default SearchResultItem;
