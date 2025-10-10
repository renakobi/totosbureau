import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

const Header = () => {
  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <HeaderDesktop />
      </div>
      
      {/* Mobile Header */}
      <div className="block lg:hidden">
        <HeaderMobile />
      </div>
    </>
  );
};

export default Header;