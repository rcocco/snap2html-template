import ceil from 'lodash/ceil';

function readableSize(size: number) {
  let count = 0;
  while (size >= 1024) {
    size /= 1024;
    count++;
  }
  const unit = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  return ceil(size, 1).toString() + ' ' + unit[count];
}

export { readableSize };