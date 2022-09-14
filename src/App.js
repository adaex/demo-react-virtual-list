import randomWords from "random-words";
import { VariableSizeList as List } from "react-window";

import "./App.css";

// 批量动态计算高度
const getRealHeightBatch = (ele, texts) => {
  const box = document.createElement("div");
  box.style.position = "fixed";
  box.style.visibility = "hidden";
  box.style.zIndex = "-999";

  // 以下都是虚拟操作，不会触发重绘
  const nodes = [];
  texts.forEach((text) => {
    const node = ele.cloneNode();
    node.innerText = text;
    box.appendChild(node);
    nodes.push(node);
  });

  // 开始重绘
  document.body.append(box);
  const sizes = nodes.map((node) => node.clientHeight);

  document.body.removeChild(box);

  return sizes;
};

// 模拟生成文字
const rowsWords = new Array(10000)
  .fill(true)
  .map(() => randomWords({ min: 3, max: 50 }).join(" "));
const rowSizes = [];

const Row = ({ index, style }) => (
  <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
    {rowsWords[index]}
  </div>
);

const checkSize = () => {
  if (rowSizes.length > 0) return;

  // 根据文字动态计算高度（注意测试下这个的性能损耗）
  // 10000 600ms
  // 1000 75ms
  // 100 15ms
  // 准备一个计算的div
  const ele = document.createElement("div");
  ele.style.width = window.clientHeight;

  console.time("rowSizes");
  const sizes = getRealHeightBatch(ele, rowsWords).map((size) => size + 20);
  rowSizes.push(...sizes);
  console.timeEnd("rowSizes");
};

const App = () => {
  console.log("render");

  checkSize();

  return (
    <List
      className="List"
      height={750}
      itemCount={rowsWords.length}
      itemSize={(index) => rowSizes[index]}
      width={document.body.clientWidth}
    >
      {Row}
    </List>
  );
};
export default App;
