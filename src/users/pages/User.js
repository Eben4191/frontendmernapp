import { Box, Center, Container, Stack } from "@chakra-ui/react";
import UserList from "../component/UserList";
import { useEffect, useRef, useState } from "react";
import { useHttpClient } from "../../shared/components/connectbackend/Http-hook";
import ErrorModal from "../../shared/Uti/ErrolModal";
import LoadingSpinner from "../../shared/Uti/LoadingSpinner";
import UserSkeleton from "../component/UserSkeleton";

const User = () => {
  const [loadedUser, setLoadedUser] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const bottomRef = useRef(null);
  const loadingRef = useRef(false);

  const { sendRequest, clearError, isLoading, error } = useHttpClient();

  // ✅ SAFE API URL (fallback prevents production crash)
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://mernapp-6uvs.onrender.com/api";

  // 🔹 Fetch users (paginated)
  useEffect(() => {
    const fetchUsers = async () => {
      if (!hasMore || loadingRef.current) return;

      try {
        loadingRef.current = true;

        const responseData = await sendRequest(
          `${API_URL}/users?page=${page}&limit=10`
        );

        if (!responseData?.users || responseData.users.length === 0) {
          setHasMore(false);
          return;
        }

        setLoadedUser(prev => [...prev, ...responseData.users]);
      } catch (err) {
        console.error("Fetching users failed:", err);
      } finally {
        loadingRef.current = false;
      }
    };

    fetchUsers();
  }, [sendRequest, page, hasMore, API_URL]);

  // 🔹 Infinite scroll observer
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(entries => {
      if (
        entries[0].isIntersecting &&
        !isLoading &&
        !loadingRef.current
      ) {
        setPage(prev => prev + 1);
      }
    });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      <Container maxW="3xl">
        <Stack spacing={3}>
          {/* USERS */}
          {loadedUser.length > 0 && (
            <UserList items={loadedUser} />
          )}

          {/* SKELETON LOADERS */}
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <UserSkeleton key={i} />
            ))}

          {/* Trigger infinite scroll */}
          <Box ref={bottomRef} h="20px" />
        </Stack>

        {/* FIRST LOAD SPINNER */}
        {isLoading && loadedUser.length === 0 && (
          <Center mt={10}>
            <LoadingSpinner />
          </Center>
        )}
      </Container>
    </>
  );
};

export default User;
