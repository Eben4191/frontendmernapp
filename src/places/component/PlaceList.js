import { VStack, Box, Center, Card, Text } from "@chakra-ui/react";
import PlaceItem from "./PlaceItem";

export default function PlaceList({ items, onDelete }) {
  if (items.length === 0) {
    return (
      <Center mt="80px">
        <Card bg="white" color="black" p="40px">
          <Text fontSize="lg">Places not found</Text>
        </Card>
      </Center>
    );
  }

  return (
    <VStack spacing={6} align="stretch" px={{ base: 2, md: 6, lg: 20 }} mt={6}>
      {items.map((place) => (
        <Box
          key={place.id}
          w={{ base: "100%", md: "80%", lg: "60%" }}
          mx="auto"
        >
          <PlaceItem {...place} onDelete={onDelete} />
        </Box>
      ))}
    </VStack>
  );
}
