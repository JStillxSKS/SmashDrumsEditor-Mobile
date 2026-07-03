import { ChartEditor } from "./components/ChartEditor";
import { SidebarDrawer, useSidebarDrawers } from "./components/SidebarDrawer";
import { SidebarLeft } from "./components/SidebarLeft";
import { SidebarRight } from "./components/SidebarRight";
import { Toolbar } from "./components/Toolbar";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";
import "./styles-future.css";

export default function App() {
  const { leftOpen, rightOpen, toggleLeft, toggleRight } = useSidebarDrawers();

  return (
    <AuthProvider>
      <div className="app app--future">
        <div className="app-shell">
          <Toolbar />
          <div
            className="workspace"
            data-left-open={leftOpen}
            data-right-open={rightOpen}
          >
            <SidebarDrawer side="left" open={leftOpen} onToggle={toggleLeft}>
              <SidebarLeft />
            </SidebarDrawer>
            <div className="editor-main">
              <ChartEditor />
            </div>
            <SidebarDrawer side="right" open={rightOpen} onToggle={toggleRight}>
              <SidebarRight />
            </SidebarDrawer>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}