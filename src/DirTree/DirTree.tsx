import classNames from 'classnames';
import React, { useState } from 'react';
import  { Tree, Space } from 'antd';
import { FolderFilled, FolderOpenFilled } from '@ant-design/icons';
import { type File, treeData, tableData } from '../DirsData';
import "./DirTree.scss";

interface DirTreeProps {
  rootClassName?: string;
  selectedKeys: number[];
  setSelectedKeys: React.Dispatch<React.SetStateAction<number[]>>;
  setTableDataSource: React.Dispatch<React.SetStateAction<File[]>>;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

function DirTree(props: DirTreeProps) {
  const [expandedKeys, setExpandedKeys] = useState<number[]>([0])
  return <div className={classNames('dirtree', props.rootClassName)}>
    <Tree showLine={{showLeafIcon: false}}
      titleRender={({title, key})=>{
        return <Space className='dirtree__node dirtree-node'>
           <span className='dirtree-node__icon'>
           {expandedKeys.includes(key as number) ? <FolderOpenFilled/>: <FolderFilled/>}
           </span>
          <span className={classNames('dirtree-node__text', {'dirtree-node__text--bold': key === props.selectedKeys[0]})}>{title}</span>
        </Space>
      }}
      expandedKeys={expandedKeys}
      onExpand={(expandedKeys)=>{setExpandedKeys(expandedKeys as number[])}}
      selectedKeys={props.selectedKeys}
      onSelect={(keys)=>{if(keys.length>0){
        props.setSelectedKeys(keys as number[]);
        props.setShowSearch(false);
        props.setTableDataSource(tableData[keys[0] as number].children as File[]);
      }}}
      treeData={treeData}/>
  </div>
}

export default DirTree;