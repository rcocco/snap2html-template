import { Radio, Input, Space } from 'antd';
import { useState } from 'react';
import type { File } from '../DirsData';
import { searchTable } from '../searchWorker';

interface SearchProps {
  setSelectedKeys: React.Dispatch<React.SetStateAction<number[]>>;
  isTableLoading: boolean;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setTableDataSource: React.Dispatch<React.SetStateAction<File[]>>;
}

function Search(props: SearchProps) {
  const [searchType, setSearchType] = useState<'name'|'nameHash'>('name');
  return <Space direction='vertical'>
    <Input.Search enterButton allowClear
      onSearch={(v)=>{if(v!=="" && !props.isTableLoading){
        searchTable(searchType, v).then((files)=>{
          props.setTableDataSource(files);
          props.setIsTableLoading(false);
          props.setShowSearch(true);
        })
        props.setIsTableLoading(true);
        props.setSelectedKeys([]);
      }}}
      style={{width: '250px'}} />
    <Radio.Group value={searchType}
      buttonStyle="solid"
      size="small"
      onChange={e=>setSearchType(e.target.value)}
    >
      <Radio.Button value="name">按名称</Radio.Button>
      <Radio.Button value="nameHash">按SHA1</Radio.Button>
    </Radio.Group>
  </Space>
}
export default Search;