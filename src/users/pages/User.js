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

  const bottomRef = useRef(); //useRef is used for referencing DOM elements directly
  const loadingRef = useRef(false); // local guard to avoid rapid observer triggers

  const { sendRequest, clearError, isLoading, error } = useHttpClient();

  // 🔹 Fetch users (paginated)
  useEffect(() => {
    const fetchUsers = async () => {
      if (!hasMore) return;

      try {
        loadingRef.current = true;
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users?page=${page}&limit=10`
        );

        if (responseData.users.length === 0) {
          setHasMore(false);
          return;
        }
        setLoadedUser(prev => [...prev, ...responseData.users]);//the prev is used to include the previous data to the new data we are fetching from the backend. note mongoose returns an array of objects the reason why we used an array here.
      } catch (err) {}
      finally { loadingRef.current = false; }
    };

    fetchUsers();
  }, [sendRequest, page, hasMore]);

  // 🔹 Infinite scroll observer
  //on the code below we are using intersection API built into the browser to observe when the bottomRef element comes into view.
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isLoading && !loadingRef.current) {
        loadingRef.current = true;
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

          {/* this box component is at the bottom of the list when it comes into view it will trigger the next page load */}
          <Box ref={bottomRef} h="20px" />
        </Stack>

        {/* FIRST LOAD SPINNER (optional) */}
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
