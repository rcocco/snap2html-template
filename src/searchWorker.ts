import { type File, tableData } from './DirsData';

const script = `
let tableData;
function searchTable(type, searchStr) {
  searchStr = searchStr.toLowerCase();
  const result = [];
  const rootFile = tableData[0];
  const stack = [].concat(rootFile.children).reverse();
  while(stack.length > 0) {
    const file = stack.pop();
    const text = file[type].toLowerCase();
    if(text.indexOf(searchStr) !== -1) {
      result.push(file);
    }
    if(file.children) {
      for(let i = file.children.length - 1; i >= 0; i--) {
        stack.push(file.children[i]);
      }
    }
  }
  return result;
}

self.onmessage = function(e) {
  const data = e.data;
  switch (data.type) {
    case 'init': {
      tableData = data.payload;
      break;
    }
    case 'search': {
      const files = searchTable(data.payload.type, data.payload.searchStr)
      self.postMessage(files);
    }
  };
}
`;
const blob = new Blob([script], { type: "text/javascript" })
const worker = new Worker(window.URL.createObjectURL(blob));
let resolve: (value: File[] | PromiseLike<File[]>) => void;
let isSearch = false;
function searchTable(type: "name"|"nameHash", searchStr: string):Promise<File[]>{
  if(isSearch) {
    return Promise.resolve([]);
  }else {
    isSearch = true;
    return new Promise((r)=>{
      resolve = r;
      worker.postMessage({type:'search', payload: {type, searchStr}});
    });
  }
}
worker.onmessage = function(e) {
  resolve(e.data)
  isSearch = false;
}
worker.postMessage({type:'init', payload: tableData});
export { searchTable };