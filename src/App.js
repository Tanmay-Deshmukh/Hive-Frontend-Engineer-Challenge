import React, { useState } from 'react';
import Dropdown from './components/Dropdown';
import './App.css';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'melon', label: 'Melon' },
];

// Used for testing performance with a large number of options
// let options = []
// for (let i = 0; i < 10000; i++) {
//   options.push({ value: `fruit-${i}`, label: `Fruit ${i}` });
// }

function App() {
  const [singleValue, setSingleValue] = useState('');
  const [multiValue, setMultiValue] = useState([]);

  return (
    <div className="app">
      <h1>Custom Dropdown Demo</h1>
      <p className="author-name">By Tanmay Deshmukh</p>
      
      <div className="dropdowns-container">
        <div className="dropdown-section">
          <h2>Single Select</h2>
          <Dropdown
            options={options}
            value={singleValue}
            onChange={setSingleValue}
            placeholder="Select a fruit..."
          />
        </div>

        <div className="dropdown-section">
          <h2>Multi Select</h2>
          <Dropdown
            options={options}
            value={multiValue}
            onChange={setMultiValue}
            isMulti={true}
            placeholder="Select multiple fruits..."
          />
        </div>
      </div>
    </div>
  );
}

export default App;