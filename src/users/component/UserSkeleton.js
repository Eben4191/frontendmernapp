import { Box, Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export default function UserSkeleton() {
  return (
    <Box
      p={4}
      border="1px solid"
      borderColor="gray.600"
      borderRadius="lg"
      bg="gray.700"
    >
      <Flex align="center" gap={4}>
        <SkeletonCircle size="10" />
        <SkeletonText noOfLines={2} spacing="3" w="200px" />
      </Flex>
    </Box>
  );
}
