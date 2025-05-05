import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useMemo,
} from "react";
import Tree from "../utils/treeUtils";

const FileTreeContext = createContext();
const tree = new Tree().load({
  id: "1",
  parentId: null,
  value: {
    name: "root",
    path: "root",
    type: "folder",
  },
  children: [
    {
      id: "2",
      parentId: "1",
      value: {
        name: "src",
        type: "folder",
        path: "root/src",
      },
      children: [
        {
          id: "3",
          parentId: "2",
          value: {
            name: "components",
            type: "folder",
            path: "root/src/components",
          },
          children: [
            {
              id: "4",
              parentId: "3",
              value: {
                name: "Header.jsx",
                type: "file",
                path: "root/src/components/Header.jsx",
              },
              children: [],
            },
            {
              id: "5",
              parentId: "3",
              value: {
                name: "Footer.jsx",
                type: "file",
                path: "root/src/components/Footer.jsx",
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "7",
      parentId: "1",
      value: {
        name: "package.json",
        type: "file",
        path: "root/package.json",
      },
      children: [],
    },
  ],
});

function reducer(state, action) {
  switch (action.type) {
    case "REMOVE_NODE":
      state.remove(action.id);
      break;
    case "RENAME_NODE":
      state.modify(action.id, action.newValue);
      break;
    case "ADD_NODE":
      state.add(action.node);
      break;
    default:
      break;
  }
  return state.clone();
}

export function FileTreeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, tree);
  const [selectedItemId, setSelectedItemId] = useState("");

  const proxyState = useMemo(() => {
    return new Proxy(state, {
      get(target, prop) {
        return target[prop];
      },
    });
  }, [state]);

  return (
    <FileTreeContext.Provider
      value={{
        state: proxyState,
        dispatch,
        setSelectedItemId,
        selectedItemId,
      }}
    >
      {children}
    </FileTreeContext.Provider>
  );
}

export function useFileTreeContext() {
  const context = useContext(FileTreeContext);
  if (!context)
    throw new Error("useFileTreeContext must be used within FileTreeProvider");
  return context;
}
