import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

declare global {
  interface Window {
    dirs: string[][];
    numberOfFiles: number;
    numberOfDirs: number;
    totalSize: number;
    snapGenTime: string;
  }
}

ReactDOM.render(<App />, 
  document.getElementById('root') as HTMLElement);
