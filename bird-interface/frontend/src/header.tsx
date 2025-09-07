import { Link } from "react-router";

export function Header(){
    return (<>
    <div style={
        {
            display:"flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "60px",       // fixed height
            backgroundColor: "rgba(168, 228, 112, 1)",
            color: "white",
            padding: "0 16px",
            gap: "16px",
        }
    }>
        <Link to="/" style={{color:"black", textDecoration:"none"}}>▶️ View</Link>
        <Link to="/settings" style={{ color:"black", textDecoration:"none"}}>⚙️ Settings</Link>
    </div>
</>);}