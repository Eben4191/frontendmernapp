import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function UserListItem(props) {
  return (
    <Box
      as="li"
      listStyleType="none"
      w="100%"
      p={4}
      border="1px solid"
      borderColor="gray.600"
      borderRadius="lg"
      bg="gray.700"
      _hover={{ bg: "gray.600" }}
      transition="background 0.2s"
      mt='10px'
    >
      <Flex align="center" justify="space-between">
        {/* Left: Avatar + Info */}
        <Flex align="center" gap={4}>
          <Avatar
            name={`${props.firstname} ${props.lastname}`}
            src={props.image}
            size="md"
          />

          <Box>
            <Heading size="sm">
              {props.firstname} {props.lastname}
            </Heading>
            <Text fontSize="sm" color="gray.300">
              {props.places.length} shared places
            </Text>
          </Box>
        </Flex>

        {/* Right: Action */}
        <Link to={`/${props.id}/places`}>
          <Button
            size="sm"
            colorScheme="yellow"
            px={6}
          >
            View Places
          </Button>
        </Link>
      </Flex>
    </Box>
  );
}
