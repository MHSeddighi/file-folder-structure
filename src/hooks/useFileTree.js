import { useFileTreeContext } from "../context/FileTreeProvider";
import { TreeNode } from "../utils/treeUtils";

export function useFileTree() {
  const { state, dispatch, setSelectedItemId, selectedItemId } =
    useFileTreeContext();

  const handleRemove = (nodeId) => {
    dispatch({ type: "REMOVE_NODE", id: nodeId });
  };

  const handleRename = (id) => {
    const {
      node: { value = {} },
    } = state.find(id);
    const name = prompt(`Enter new name`, value.name) || value.name;
    dispatch({ type: "RENAME_NODE", id, newValue: { ...value, name } });
  };

  const onSelectItem = (itemId) => {
    setSelectedItemId(itemId);
  };

  const handleAddNode = (name, type) => {
    if (!selectedItemId) {
      alert("Please select a folder or file first.");
      return;
    }

    const { node: folder } = state.find(selectedItemId);

    if (state.find({ name }, folder)) {
      alert("This folder/file already existed");
      return;
    }

    const newNode = new TreeNode({
      value: {
        name,
        path: folder.value.path + "/" + name,
        type,
      },
      children: [],
      parentId: folder.value.type == "folder" ? folder.id : folder.parentId,
    });

    dispatch({
      type: "ADD_NODE",
      node: newNode,
    });
  };

  const handleAddRouteNodes = (name, type) => {
    const { node: folder } = state.find(selectedItemId);

    if (!folder) {
      alert("Please select a folder or file first.");
      return;
    }

    const route = name.split("/");
    let newNode;
    let nodeType;
    for (let i = 0; i < route.length; i++) {
      const name = route[i];
      nodeType = i === route.length - 1 ? type : "folder";
      newNode = state.find({ name }, folder.id)?.node;
      if (!newNode) {
        newNode = state.createNewNode({
          value: {
            name,
            path: folder.value.path + "/" + name,
            type,
          },
          children: [],
          parentId: folder.id,
        });
        state.add(newNode);
      }
      folder = newNode;
    }
    dispatch({
      type: "",
    });
  };

  const handleAdd = (type) => {
    const name = prompt(`Enter ${type} name`);
    if (!name) return;
    if (name.includes("/")) {
      handleAddRouteNodes(name, type);
    } else {
      handleAddNode(name, type);
    }
  };

  return {
    state,
    selectedItemId,
    handleRemove,
    handleRename,
    onSelectItem,
    handleAdd,
  };
}
