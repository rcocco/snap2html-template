import { useMemo } from 'react';
import { Table, Space, Breadcrumb } from 'antd';
import { FolderFilled, FileOutlined, CaretRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { readableSize } from '../Utils';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { tableData, type File } from '../DirsData';
import './DirTable.scss';

interface DirTableProps {
  selectedKeys: number[];
  setSelectedKeys: React.Dispatch<React.SetStateAction<number[]>>;
  rootClassName?: string;
  tableDataSource: File[];
  setTableDataSource: React.Dispatch<React.SetStateAction<File[]>>;
  isTableLoading: boolean;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

function DirTable(props: DirTableProps) {
  const columns:{[key: string]: ColumnType<File>} = useMemo(()=>{
    return {
      name: {
        dataIndex: "name",
        title: <div className='dir-table__header'>名称</div>,
        shouldCellUpdate: () => false,
        render: function (name, rowData: File) {
          return (<Space>
            <span>
              {rowData.isDirectory ? <FolderFilled style={{ color: '#f2d06c' }} /> : <FileOutlined />}
            </span>
            {rowData.isDirectory?
              <span className='dir-table-column__name dir-table-column__name--hover'
                    onClick={()=>{
                      props.setSelectedKeys([rowData.key as unknown as number])
                      props.setTableDataSource(tableData[rowData.key as unknown as number].children as File[]);
                      props.setShowSearch(false);
                    }
                  }
              >{name}</span>
              :<span className="dir-table-column__name">{name}</span>}
          </Space>)
        },
        sorter: function (a, b) {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          if (a.name < b.name) return -1;
          if (b.name < a.name) return 1;
          return 0;
        },
        sortDirections: ['descend', 'ascend']
      },
      size: {
        dataIndex: 'size',
        title: '大小',
        width: '100px',
        shouldCellUpdate: () => false,
        render: function (size) {
          return readableSize(size);
        },
        sorter: function (a, b) {
          return a.size - b.size;
        },
      },
      modifiedTime : {
        dataIndex: 'modifiedTime',
        title: '修改时间',
        width: '180px',
        shouldCellUpdate: () => false,
        render: function (time) {
          return dayjs.unix(time).format('YYYY/M/D HH:mm:ss');
        },
        sorter: function (a, b) {
          return a.modifiedTime - b.modifiedTime;
        },
      },
      nameHash: {
        dataIndex: 'nameHash',
        title: '名称SHA1',
        width: '200px'
      },
      location: {
        dataIndex: 'location',
        title: '位置',
        width: '250px',
        shouldCellUpdate: () => false,
        render: function (location, rowData: File) {
          return (<Space>
            <FolderFilled style={{ color: '#f2d06c' }} />
            <span className='dir-table-column__location dir-table-column__location--hover'
                onClick={()=>{
                  props.setSelectedKeys([rowData.parent!.key as unknown as number])
                  props.setTableDataSource(tableData[rowData.parent!.key as unknown as number].children as File[]);
                  props.setShowSearch(false);
                }}
                >{location}</span>
          </Space>)
        },
        sorter: function (a, b) {
          if (a.location < b.location) return -1;
          if (b.location < a.location) return 1;
          return 0;
        },

      }
    }
  }, []);
  const dirColumns: ColumnsType<File> = useMemo(()=>[
    columns.name, columns.size, columns.modifiedTime, columns.nameHash
  ], []);
  const searchColumns: ColumnsType<File> = useMemo(()=>[
    columns.name, columns.location, columns.size, columns.modifiedTime, columns.nameHash
  ],[])
  let breadcrumb: React.ReactNode;
  if(props.showSearch) {
    breadcrumb = <div className='dir-table__nav'>搜索结果：</div>
  }else {
    const breadItems = [];
    for(let cur: File|undefined = tableData[props.selectedKeys[0]];
      cur !== undefined;
      cur = cur.parent) {
        const {key, name} = cur;
        breadItems.push(<Breadcrumb.Item
          className='dir-table-nav__item'
          key={key}
          onClick={()=>{
            props.setSelectedKeys([key as unknown as number]);
            props.setTableDataSource(tableData[key as unknown as number].children as File[]);
            props.setShowSearch(false);
          }}
        >{name}</Breadcrumb.Item>)
    }
    breadItems.reverse();
    breadcrumb = (<Breadcrumb className='dir-table__nav'
      separator={<CaretRightOutlined/>}>
      {breadItems}
    </Breadcrumb>)
  }
  return <div className='dir-table'>
    {breadcrumb}
    <Table dataSource={props.tableDataSource}
      loading={props.isTableLoading}
      columns={props.showSearch?searchColumns:dirColumns}
      tableLayout="fixed"
      pagination={{
        defaultPageSize: 20,
        showTotal: total=>`总共 ${total} 项`,
        showSizeChanger: true,
        locale: {
          items_per_page: "项/页"
        }
      }}
      showSorterTooltip={false}
      expandable={{showExpandColumn: false}}
      className='dir-table__table'
      scroll={
        /* 表头(25px+16px*2+1px)*/
        { y: 'calc(100% - 58px)'}
      }
      footer={(curPageDatas) => {
        let fileNum = 0, folderNum = 0, fileSize = 0, folderSize = 0;
        for (const f of curPageDatas) {
          if (f.isDirectory) {
            folderNum++;
            folderSize += f.size;
          } else {
            fileNum++;
            fileSize += f.size;
          }
        }
        return <div className='dir-table__footer'>
          本页共计 {folderNum} 目录 ({readableSize(folderSize)}), {fileNum} 文件 ({readableSize(fileSize)})
        </div>
      }}
    />
  </div>
}

export default DirTable;