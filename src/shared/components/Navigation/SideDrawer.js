// src/shared/components/Navigation/SideDrawer.jsx

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Button,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Uti/Auth';

export default function SideDrawer({ isOpen, onClose }) {
  const auth = useContext(AuthContext)
  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen} size='xs'>
      <DrawerOverlay />
      <DrawerContent bg="#1A202C" color="white">
        <DrawerCloseButton />
        <DrawerHeader>Menu</DrawerHeader>
        <DrawerBody>
          <VStack spacing={7} align="stretch">
            <Button
              as={NavLink}
              bg=' #f8df00'
              to="/"
              onClick={onClose}
              _hover={{bg:'white.100'}}
            >
              All Users
            </Button>
        {auth.isLoggedIn &&(
            <Button
            bg='#f8df00'
              as={NavLink}
              to={`/${auth.userId}/places`}
              variant="ghost"
              onClick={onClose}
              _hover={{ bg: 'gray.700' }}
            >
              My Places
            </Button>
            )}
            {auth.isLoggedIn && (
            <Button
            bg='#f8df00'
              as={NavLink}
              to="/places/new"
              onClick={onClose}
              _hover={{ bg: 'gray.700' }}
            >
              Add Place
            </Button>
            )}
            {!auth.isLoggedIn &&(
            <Button
            bg='#f8df00'
              as={NavLink}
              to="/signup"
              onClick={onClose}
              _hover={{ bg: 'gray.700' }}
            >
              Signup
            </Button>
            )}
            {!auth.isLoggedIn &&(
            <Button
            bg='#f8df00'
              as={NavLink}
              to="/login"
              onClick={onClose}
              _hover={{ bg: 'gray.700' }}
            >
              Login
            </Button>
            )}
            {auth.isLoggedIn && (
              <Button
               bg='#f8df00'
              as={NavLink}
              to="/login"
              _hover={{ bg: 'gray.700' }}
              onClick={auth.logout}

              >
                Logout
              </Button>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
