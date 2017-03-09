
export default function init(nodes) {
  const textArea = document.getElementById('output');
  textArea.value = JSON.stringify(nodes, null, 2);
}
