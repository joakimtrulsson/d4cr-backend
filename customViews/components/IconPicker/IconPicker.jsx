import { Edit, Search } from '@mui/icons-material';
import {
  IconButton,
  Popover,
  TextField,
  InputAdornment,
  Divider,
  Skeleton,
} from '@mui/material';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './iconPicker.scss';
import { useFontAwesomeIconPack } from './hooks/useIconPickerPack';

const IconPicker = ({ value, onChange }) => {
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const iconPack = useFontAwesomeIconPack();

  if (!iconPack) {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <Skeleton variant='rectangular' width={210} height={40} />;
  }

  const iconsFiltered = iconPack.filter((icon) => {
    return icon.iconName.includes(searchText.toLowerCase());
  });

  const uniqueIcons = Array.from(new Set(iconsFiltered.map((icon) => icon.iconName))).map(
    (iconName) => {
      return iconsFiltered.find((icon) => icon.iconName === iconName);
    }
  );
  return (
    <>
      <TextField
        fullWidth
        placeholder='Select an icon'
        value={value}
        InputProps={{
          style: {
            marginBottom: '1rem',
            backgroundColor: '#fafbfc',
            borderRadius: '7px',
            border: '1px solid #e1e5e9',
          },
          readOnly: true,
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton size='small' onClick={(e) => setAnchorEl(e.currentTarget)}>
                {value ? (
                  // Dynamiskt prefix baserat på ikonens namn (value)
                  <FontAwesomeIcon
                    icon={[
                      iconPack.find((icon) => icon.iconName === value)?.prefix,
                      value,
                    ]}
                    color='#556ee6'
                  />
                ) : (
                  <Edit fontSize='small' />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        variant='outlined'
        size='small'
      />
      <Popover
        className='iconPicker'
        id={anchorEl ? 'iconPickerPopover' : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          className: 'iconPicker__paper',
        }}
      >
        <div className='iconPicker__popoverContainer'>
          <div className='iconPicker__popoverHeader'>
            <TextField
              fullWidth
              placeholder='Search'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
              }}
              size='small'
              variant='outlined'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Divider />
          <div className='iconPicker__iconsContainer'>
            {uniqueIcons.map((icon) => (
              <div className='iconPicker__iconWrapper' key={icon.iconName}>
                <button
                  className={`iconPicker__iconItem ${
                    icon.iconName === value ? 'selected' : ''
                  }`}
                  title={icon.iconName}
                  onClick={() => onChange?.(icon.iconName)}
                >
                  <FontAwesomeIcon icon={icon} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Popover>
    </>
  );
};

export default IconPicker;
