import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function ErrorModal(props) {
  return (
    <Modal isOpen={!!props.error} onClose={props.onClear} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Text>{props.error}</Text>
        </ModalBody>
        <ModalFooter>
          <Link to='/'>
          <Button colorScheme="yellow" onClick={props.onClear} >
            Okay
          </Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
