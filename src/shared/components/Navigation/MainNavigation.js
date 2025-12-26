
import { Heading, useDisclosure } from '@chakra-ui/react'; // ✅ Import this
import NavLink from './NavLink';
import MainHeader from './MainHeader';
import SideDrawer from './SideDrawer';
import './MainNavigation.css';
import { useContext } from 'react';
import { AuthContext } from '../../Uti/Auth';

const MainNavigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // ✅ Drawer control
  const auth = useContext(AuthContext);

  return (
    <>
      {/* ✅ Drawer for mobile */}
      <SideDrawer isOpen={isOpen} onClose={onClose} />

      <MainHeader>
        {/* ✅ Hamburger button (visible on mobile) */}
        <button className="main-navigation__menu-btn" onClick={onOpen}>
          <span />
          <span />
          <span />
        </button>

        {/* ✅ App title */}
       {auth.isLoggedIn && auth.userName ? (
       <Heading as='h4'  fontSize={{ base: 'lg', sm: 'xl', md: '3xl' }} >Welcome, {auth.userName}</Heading>  ) : ( <Heading>YOUR PLACES APP</Heading>  )}
       {console.log(auth.userName)}

        {/* ✅ Desktop nav links */}
        <nav className="main-navigation__header-nav">
          <NavLink />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
