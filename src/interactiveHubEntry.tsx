import React from 'react';
import ReactDOM from 'react-dom/client';
import { InteractiveDevHub } from './components/InteractiveDevHub';

const el = document.getElementById('react-interactive-hub');
if (el) {
  ReactDOM.createRoot(el).render(<React.StrictMode><InteractiveDevHub /></React.StrictMode>);
}
