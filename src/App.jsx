import "./App.css";
import Sidebar from "./components/Sidebar";
import { Content } from "./components/Content";
import { useState } from "react";
import { FileTreeProvider } from "./context/FileTreeProvider";

function App() {
  const [selectedItem, setSelectedItem] = useState();
  return (
    <FileTreeProvider>
      <div className="wrapper">
        <Sidebar
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
        <Content selectedItem={selectedItem} />
      </div>
    </FileTreeProvider>
  );
}

export default App;
