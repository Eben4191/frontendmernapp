import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Container,
  Divider,
  Heading,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import MapModal from "../../shared/Uti/MapModal";
import { AuthContext } from "../../shared/Uti/Auth";
import { useContext, useState } from "react";
import { useHttpClient } from "../../shared/components/connectbackend/Http-hook";
import ErrorModal from "../../shared/Uti/ErrolModal";
import LoadingSpinner from "../../shared/Uti/LoadingSpinner";

export default function PlaceItem(props) {
  const auth = useContext(AuthContext);
  const { sendRequest, clearError, isLoading, error } = useHttpClient();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Delete modal
  const openDeleteModal = () => setIsDeleteOpen(true);
  const closeDeleteModal = () => setIsDeleteOpen(false);

  // Image modal
  const openImageModal = () => setIsImageOpen(true);
  const closeImageModal = () => setIsImageOpen(false);

  // Delete logic
  const confirmedDelete = async () => {
    setIsDeleteOpen(false);
    try {
      await sendRequest(
        `/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} isCentered>
        <ModalOverlay />
        <ModalContent bg="#1A202C" color="white">
          <ModalBody>
            <Text>
              Are you sure you want to delete this place? Click Delete to
              confirm.
            </Text>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button onClick={closeDeleteModal} colorScheme="yellow">
                Close
              </Button>
              <Button onClick={confirmedDelete} colorScheme="red">
                Delete
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Image Modal */}
      <Modal isOpen={isImageOpen} onClose={closeImageModal} isCentered size="xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalBody p={0}>
            <Image
              src={props.image}
              alt={props.title}
              w="100%"
              maxH="80vh"
              objectFit="contain"
              borderRadius="md"
            />
          </ModalBody>
          <ModalFooter justifyContent="center">
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Main Content */}
      <Container position="relative">
        {isLoading && (
          <Center
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            zIndex={10}
          >
            <LoadingSpinner />
          </Center>
        )}

        <Box as="li" listStyleType="none" m={4}>
          <Card
            bg="gray.700"
            color="white"
            boxShadow="lg"
            borderRadius="2xl"
            overflow="hidden"
            w="100%"
          >
            <CardBody p={0}>
              {/* Clickable Image */}
              <Box onClick={openImageModal} cursor="zoom-in">
                <Image
                  src={props.image}
                  alt={props.title}
                  w="100%"
                  h={{ base: "200px", md: "250px", lg: "300px" }}
                  objectFit="cover"
                />
              </Box>

              <Stack mt={4} spacing={2} px={4}>
                <Heading size="md">{props.title}</Heading>
                <Text fontSize="sm" color="gray.300">
                  Address: {props.address}
                </Text>
                <Text fontSize="sm">{props.description}</Text>
              </Stack>
            </CardBody>

            <Divider />
            <CardFooter>
              <HStack justify="space-between" w="100%">
                <MapModal title={props.title} center={props.location} />
                {auth.userId === props.creator && (
                  <HStack spacing={4}>
                    <Link to={`/places/${props.id}`}>
                      <Button colorScheme="yellow">Edit</Button>
                    </Link>
                    <Button colorScheme="red" onClick={openDeleteModal}>
                      Delete
                    </Button>
                  </HStack>
                )}
              </HStack>
            </CardFooter>
          </Card>
        </Box>
      </Container>
    </>
  );
}
