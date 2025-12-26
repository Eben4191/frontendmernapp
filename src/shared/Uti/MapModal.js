import { 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton, 
  useDisclosure 
} from "@chakra-ui/react";
import Map from "./Map";

export default function MapModal({ title, center, zoom = 14 }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="yellow" onClick={onOpen}>
        View on Map
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        size={{ base: "full", md: "xl" }} 
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="#1A202C" color="white">
          <ModalHeader>{title || "Location"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Map center={center} zoom={zoom} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="yellow" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
