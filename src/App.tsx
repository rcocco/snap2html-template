import { useState } from 'react';
import './App.scss';
import DirTree from './DirTree/DirTree';
import DirTable from './DirTable/DirTable';
import Search from './Search/Search';
import Stats from './Stats/Stats';
import { type File, tableData } from './DirsData';

function App() {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([0]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [tableDataSource, setTableDataSource] = useState<File[]>(()=>tableData[0].children as File[]);
  return (<>
    <header className="page__header">
      <Stats/>
      <Search setSelectedKeys={setSelectedKeys}
        isTableLoading={isTableLoading}
        setIsTableLoading={setIsTableLoading}
        setTableDataSource={setTableDataSource}
        setShowSearch={setShowSearch}
      />
    </header>
    <main className="page__main">
      <DirTree rootClassName="page__dirtree" 
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        setTableDataSource={setTableDataSource}
        setShowSearch={setShowSearch}
       />
      <DirTable selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        tableDataSource={tableDataSource}
        setTableDataSource={setTableDataSource}
        isTableLoading={isTableLoading}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        />
    </main>
  </>)
}

export default App;
