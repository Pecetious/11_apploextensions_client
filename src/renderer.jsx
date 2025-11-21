import { createRoot } from "react-dom/client";
import DBTest from "./components/DBTest";
import AddExtensionForm from "./components/AddExtensionForm";

const App = () => {
  return (
    <div>
      {/* <DBTest />*/}
      <AddExtensionForm />
    </div>
  );
};

const container = document.getElementById("root");

const root = createRoot(container);
root.render(<App />);
