import Link from "next/link";

export function Header(){
    return (<>
    <div style={
        {
            display:"flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "60px",       // fixed height
            backgroundColor: "rgba(38, 163, 80, 1)",
            color: "white",
            padding: "0 16px",
            gap: "16px",
        }
    }>
        <Link href="/">▶️ View</Link>
        <Link href="/settings">⚙️ Settings</Link>
    </div>
</>);}