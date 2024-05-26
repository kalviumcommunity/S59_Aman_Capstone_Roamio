import SideNavigation from "../components/SideNavigation/SideNavigation";

export default function RootLayout({children}){
    return (
        <div>
        <SideNavigation />
        {children}
        </div>
    )
}