import SideNavigation from "../components/SideNavigation/SideNavigation";

export default function RootLayout({ children }) {
  return (
    <div className="flex_row_center">
      <SideNavigation />
      {children}
    </div>
  );
}
