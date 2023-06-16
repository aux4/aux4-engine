class Node {
  constructor(value) {
    this.value = value;
  }
}

async function main() {
  return "main";
}

const node = new Node("Hello World!");
const proxy = new Proxy(node, {
  get(target, name) {
    if (name === "value") {
      return Promise.resolve(target.value);
    }
    return new Promise(resolve => main().then(resolve));
  }
});

(async () => {
  const value = await proxy.value;
  console.log(value);

  const other = await proxy.other;
  console.log(other);
})();
