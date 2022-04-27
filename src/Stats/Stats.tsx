import { readableSize } from '../Utils';
import "./Stats.scss";

function Stats() {
  return (<div className="stats">
    <div className="stats__icon" />
    <div>
      <h1 className='stats__title'>{document.title}</h1>
      <p className='stats__content'>总计 {window.numberOfFiles} 个文件，{window.numberOfDirs} 个目录({readableSize(window.totalSize)})</p>
      <p className='stats__content'>快照创建于 {window.snapGenTime}</p>
    </div>
  </div>);
}
export default Stats;