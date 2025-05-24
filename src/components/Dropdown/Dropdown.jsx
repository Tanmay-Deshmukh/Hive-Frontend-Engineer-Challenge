import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import PropTypes from 'prop-types';
import { ReactComponent as SearchIcon } from './icons/search-icon.svg';
import { ReactComponent as ClearIcon } from './icons/clear-icon.svg';
import './Dropdown.css';

const Dropdown = ({
  options,
  value,
  onChange,
  isMulti = false,
  placeholder = 'Select...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVirtualizing, setIsVirtualizing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const filteredOptions = useMemo(() => 
    options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    ), [options, searchTerm]);
  
  const handleClickOutside = useCallback((event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (filteredOptions.length > 1000) {
      // Show loading indicator while virtualizing
      setIsVirtualizing(true);
      const timer = setTimeout(() => setIsVirtualizing(false), 50);
      return () => clearTimeout(timer);
    }
  }, [filteredOptions]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    if (isMulti) {
      const newValue = value.includes(option.value)
        ? value.filter(v => v !== option.value)
        : [...value, option.value];
      onChange(newValue);
    } else {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  const handleClearSearch = useCallback((e) => {
    e.stopPropagation();
    setSearchTerm('');
  }, []);

  const selectAll = () => {
    if (isMulti) {
      const allValues = options.map(opt => opt.value);
      onChange(value.length === options.length ? [] : allValues);
    }
  };

  const isSelected = (valueToCheck) => 
    isMulti ? value.includes(valueToCheck) : value === valueToCheck;

  const isAllSelected = isMulti && value.length === options.length;

  const itemData = {
    options: filteredOptions,
    handleSelect,
    isSelected,
    isMulti
  };

  const Row = memo(({ index, style, data }) => {
    const option = data.options[index];
    return (
      <div
        style={style}
        onClick={() => data.handleSelect(option)}
        className={`option-item ${data.isSelected(option.value) ? 'selected' : ''}`}
      >
        {data.isMulti && (
          <input
            type="checkbox"
            checked={data.isSelected(option.value)}
            readOnly
            className="checkbox"
          />
        )}
        {option.label}
      </div>
    );
  });

  return (
    <div className="dropdown-container" ref={wrapperRef}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <div className="selected-values">
          {isMulti ? (
            value.length > 0 ? (
              value.map(val => {
                const option = options.find(opt => opt.value === val);
                return (
                  <span key={val} className="multi-value">
                    {option?.label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option);
                      }}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </span>
                );
              })
            ) : (
              placeholder
            )
          ) : (
            options.find(opt => opt.value === value)?.label || placeholder
          )}
        </div>
        <span className={`chevron ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      
      {isOpen && (
        <div className="dropdown-list">
          {isMulti && (
            <div className="select-all">
              <label>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={selectAll}
                />
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </label>
            </div>
          )}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm ? (
              <button className="search-clear" onClick={handleClearSearch}>
                <ClearIcon width="16" height="16" />
              </button>
            ) : (
              <SearchIcon className="search-icon" width="16" height="16" />
            )}
          </div>
          <div className="options-container">
            {isVirtualizing && (
              <div className="loading-indicator">
                Rendering {filteredOptions.length} items...
              </div>
            )}
            <List
              height={Math.min(250, filteredOptions.length * 35)}
              itemCount={filteredOptions.length}
              itemSize={35}
              width="100%"
              itemData={{ ...itemData, options: filteredOptions }}
            >
              {Row}
            </List>
          </div>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  onChange: PropTypes.func.isRequired,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default Dropdown;