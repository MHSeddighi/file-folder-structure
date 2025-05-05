class Tree {
  constructor(rootProps = {}) {
    this.nodeMap = new Map();
    this.root = this.#create(rootProps);
  }

  /**
   * Creates a new TreeNode and tracks it in nodeMap
   * @param {Object} props - Properties to initialize TreeNode
   * @returns {TreeNode}
   */
  #create(props) {
    const node = new TreeNode(props);
    this.nodeMap.set(node.id, node);
    return node;
  }

  /**
   * Loads a tree structure from a plain object
   * @param {Object} data
   * @returns {TreeNode}
   */
  load(data) {
    const build = (nodeData, parentId = null) => {
      const { id } = nodeData.value;
      const node = this.#create({
        value: nodeData.value,
        children: [],
        parentId,
      });

      if (Array.isArray(nodeData.children)) {
        node.children = nodeData.children.map((child) => build(child, id));
      }

      return node;
    };

    this.root = build(data);
    return this;
  }

  /**
   * Creates a shallow copy of the current tree
   * @returns {Tree}
   */
  clone() {
    const newTree = new Tree();
    newTree.nodeMap = new Map(this.nodeMap);
    newTree.root = this.root.clone();
    return newTree;
  }

  deepClone() {
    const newTree = new Tree();
    newTree.nodeMap = new Map(this.nodeMap);
    newTree.root = this.root.clone();
    return newTree;
  }

  /**
   * Sorts nodes throughout the tree based on given criteria
   * @param {TreeNode} node
   * @param {{ by: string, order: 'asc'|'desc' }} criteria
   */
  sort(node = this.root, criteria = { by: "name", order: "asc" }) {
    if (!node?.children?.length) return;
    this.traverse("pre", (n) => n.sort(criteria));
  }

  /**
   * Adds a node to the tree
   * @param {TreeNode} node
   */
  add(node) {
    if (this.nodeMap.has(node.id)) return;
    if (node.parentId) {
      this.#addByParentId(node);
    } else {
      this.root.addChild(node);
    }
    this.nodeMap.set(node.id, node);
  }

  #addByParentId(node) {
    let parent =
      this.nodeMap.get(node.parentId) || this.find(node.parentId)?.node;

    // if (!parent) {
    //   console.error(`Parent node with ID ${node.parentId} not found.`);
    //   return;
    // }

    parent.addChild(node);
  }

  /**
   * Finds a node based on a condition
   * @param {(node: TreeNode) => boolean|string|number} condition
   * @param {TreeNode} currentNode
   * @param {TreeNode[]} path
   * @returns {{ node: TreeNode, path: TreeNode[] } | null}
   */
  find(condition, currentNode = this.root, path = []) {
    const newPath = [...path, currentNode];
    if (matchesCondition(currentNode, condition)) {
      return { node: currentNode, path: newPath };
    }

    for (let child of currentNode.children) {
      const found = this.find(condition, child, newPath);
      if (found) return found;
    }

    return null;
  }

  /**
   * Removes a node by condition or ID
   * @param {(node: TreeNode) => boolean|string|number} condition
   * @returns {boolean}
   */
  remove(condition) {
    if (!this.root) return false;

    if (matchesCondition(this.root, condition)) {
      this.root = null;
      this.nodeMap?.clear?.();
      return true;
    }

    const node = this.nodeMap?.get?.(condition);

    if (node?.parentId) {
      const parent = this.nodeMap?.get?.(node.parentId);
      if (parent) {
        parent.children = parent.children.filter(
          (child) => !matchesCondition(child, condition)
        );
        this.nodeMap.delete(condition);
        return true;
      }
    } else {
      return this.traverse("pre", (node) => {
        const before = node.children.length;
        node.children = node.children.filter(
          (child) => !matchesCondition(child, condition)
        );
        this.nodeMap.delete(condition);
        return before !== node.children.length;
      });
    }

    return false;
  }

  /**
   * Modify a node's value based on a condition
   * @param {(node: TreeNode) => boolean|string|number} condition
   * @param {*} newValue
   */
  modify(condition, newValue) {
    const node = this.nodeMap?.get?.(condition);
    if (node) {
      node.value = newValue;
      return;
    }

    this.traverse("pre", (node) => {
      if (matchesCondition(node, condition)) {
        node.value = newValue;
        return true;
      }
    });
  }

  /**
   * Traverses the tree with the specified order
   * @param {'pre'|'post'|'breadth'} order
   * @param {(node: TreeNode, parent: TreeNode | null) => boolean} callback
   */
  traverse(order = "pre", callback) {
    if (!this.root) return;

    const strategies = {
      pre: () => this.#preOrder(this.root, callback),
      post: () => this.#postOrder(this.root, callback),
      breadth: () => this.#breadthFirst(this.root, callback),
    };

    const strategy = strategies[order];
    if (!strategy) {
      throw new Error(`Unknown traversal order: ${order}`);
    }

    strategy();
  }

  #preOrder(node, callback, parent = null) {
    if (callback(node, parent)) return true;
    return node.children.some((child) => this.#preOrder(child, callback, node));
  }

  #postOrder(node, callback, parent = null) {
    for (const child of node.children) {
      if (this.#postOrder(child, callback, node)) return true;
    }
    return callback(node, parent);
  }

  #breadthFirst(root, callback) {
    const queue = [{ node: root, parent: null }];
    while (queue.length > 0) {
      const { node, parent } = queue.shift();
      if (callback(node, parent)) return true;
      for (const child of node.children) {
        queue.push({ node: child, parent: node });
      }
    }
  }
}

export class TreeNode {
  constructor({ value = {}, children = [], parentId = null }) {
    this.id = this.#generateId();
    this.value = value;
    this.children = children;
    this.parentId = parentId;
  }

  #generateId() {
    return "id-" + Math.random().toString(36).substring(2, 9);
  }

  clone() {
    return new TreeNode({
      value: this.value,
      children: this.children,
      parentId: this.parentId,
    });
  }

  addChild(node) {
    this.children.push(node);
  }

  filter(condition) {
    this.children = this.children.filter(() =>
      matchesCondition(this, condition)
    );
  }

  sort(criteria = { by: "name", order: "asc" }) {
    this.children.sort((a, b) => compare(a, b, criteria));
  }
}

export default Tree;

export function matchesCondition(node, condition) {
  if (typeof condition === "string") {
    return node.id === condition;
  }
  if (typeof condition === "object" && condition !== null) {
    return Object.entries(condition).every(
      ([key, value]) => node[key] === value
    );
  }
  if (typeof condition === "function") {
    return condition(node);
  }
  return false;
}

export function compare(a, b, { by, order }) {
  let valueA = a.value[by];
  let valueB = b.value[by];

  if (typeof valueA === "string" && typeof valueB === "string") {
    return order === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  }

  if (typeof valueA === "number" && typeof valueB === "number") {
    return order === "asc" ? valueA - valueB : valueB - valueA;
  }

  return 0;
}

export function buildPathCache(tree, basePath = "", cache = new Map()) {
  for (const file of tree.files || []) {
    cache.set(file.id, `${basePath} > ${file.name}`);
  }

  for (const folder of tree.folders || []) {
    const folderPath = `${basePath} > ${folder.name}`;
    cache.set(folder.id, folderPath);
    if (folder.children) {
      buildPathCache(folder.children, folderPath, cache);
    }
  }
  return cache;
}

export function addNode(folder, newNode) {
  if (newNode.type === "folder") {
    folder.children.folders.push(newNode);
    folder.children.folders.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    folder.children.files.push(newNode);
    folder.children.files.sort((a, b) => a.name.localeCompare(b.name));
  }
  return folder;
}

export function removeNode(tree, nodeId) {
  if (!tree.children) return tree;

  const folders = tree.children.folders || [];
  const files = tree.children.files || [];

  for (let i = folders.length - 1; i >= 0; i--) {
    if (folders[i].id === nodeId) {
      folders.splice(i, 1);
    } else {
      removeNode(folders[i], nodeId);
    }
  }

  for (let i = files.length - 1; i >= 0; i--) {
    if (files[i].id === nodeId) {
      files.splice(i, 1);
      break;
    }
  }

  return tree;
}
