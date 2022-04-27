import { type DataNode } from 'antd/es/tree';
import sha1 from 'crypto-js/sha1';
const hashSalt = '';

interface File {
  key: string;
  name: string;
  nameHash: string;
  location: string;
  size: number;
  modifiedTime: number;
  isDirectory: boolean;
  parent?: File;
  children?: File[];
}

type Datas = {
  treeData: DataNode[];
  tableData: File[];
}
function createDirsData(): Datas {
  const dirs = window.dirs;
  const dirsData: File[] = [];
  function createDir(dirKey: number, parent?: File): {tree: DataNode, table: File} {
    const dirData = dirs[dirKey];
    const [dirFullPath, , dirModifiedTime] = dirData[0].split('*');
    const lastIndexSlash = dirFullPath.lastIndexOf('/');
    const dirLocation = dirFullPath.slice(0, lastIndexSlash!==-1?lastIndexSlash:undefined);
    const dirName = dirFullPath.slice(lastIndexSlash + 1);
    const dirNameHash = sha1(hashSalt + dirName).toString();
    dirsData[dirKey] = {
      key: String(dirKey),
      parent: parent,
      name: dirName,
      nameHash: dirNameHash,
      location: dirLocation,
      size: 0, // placeholder, need set later
      modifiedTime: +dirModifiedTime,
      isDirectory: true,
    }
    const subDirsKey = dirData[dirData.length - 1].split('*').filter(s => s !== "");
    const subFiles: File[] = dirData.slice(1, dirData.length - 2).map(fileStr => {
      const [fileName, fileSize, fileModifiedTime] = fileStr.split('*');
      const fileNameHash = sha1(hashSalt + fileName).toString();
      const file = {
        key: dirKey + "-" + fileName,
        name: fileName,
        parent: dirsData[dirKey],
        nameHash: fileNameHash,
        location: dirFullPath,
        size: +fileSize,
        modifiedTime: +fileModifiedTime,
        isDirectory: false,
      };
      return file;
    });
    const subFilesSize = +dirData[dirData.length - 2];
    let subDirsTreeData: DataNode[] = [];
    let subDirsTableData: File[] = [];
    for(const subDirKey of subDirsKey) {
      const {tree, table} = createDir(+subDirKey, dirsData[dirKey]);
      subDirsTreeData.push(tree);
      subDirsTableData.push(table);
    }
    const subDirsSize = subDirsTableData.reduce((acc, dirFile) => {
      return acc + dirFile.size;
    }, 0);
    dirsData[dirKey].size = subFilesSize + subDirsSize;
    dirsData[dirKey].children = subDirsTableData.concat(subFiles);
    return {
      tree: {
        key: dirKey,
        title: dirName,
        children: subDirsTreeData
      },
      table: dirsData[dirKey]
    }
  }
  return {
    treeData: [createDir(0).tree],
    tableData: dirsData,
  };
}

const {treeData, tableData } = createDirsData();

export {treeData, tableData, type File};