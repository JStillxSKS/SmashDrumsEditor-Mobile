import { ChartEditor } from "./components/ChartEditor";
import { SidebarLeft } from "./components/SidebarLeft";
import { SidebarRight } from "./components/SidebarRight";
import { Toolbar } from "./components/Toolbar";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";
import "./styles-future.css";

export default function App() {
  return (
    <AuthProvider>
    <div className="app app--future">
      <div className="app-shell">
        <Toolbar />
        <div className="workspace">
          <div className="sidebar-wing">
            <SidebarLeft />
          </div>
          <div className="editor-main">
            <ChartEditor />
          </div>
          <div className="sidebar-wing">
            <SidebarRight />
          </div>
        </div>
      </div>
    </div>
    </AuthProvider>
  );
}