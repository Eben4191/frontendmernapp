import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../shared/Uti/Auth";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../shared/components/connectbackend/Http-hook";
import LoadingSpinner from "../../shared/Uti/LoadingSpinner";
import ErrorModal from "../../shared/Uti/ErrolModal";

export default function Login() {
  const auth = useContext(AuthContext);
  const { clearError, isLoading, sendRequest, error } = useHttpClient();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: values.email,
            password: values.password,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        // use responseData
        auth.login(responseData.userId, responseData.token, responseData.userName);
      } catch (err) {
        console.log(err);
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required("Required"),
      password: Yup.string()
        .min(6, "Must not be less than 6 characters in length")
        .required("Required"),
    }),
  });

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Container maxW="md" py={10} display="flex" justifyContent="center" alignItems="center">
        {isLoading && (
          <Center
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            bg="rgba(255,255,255,0.7)"
            zIndex={10}
          >
            <LoadingSpinner />
          </Center>
        )}
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <VStack spacing={6} align="stretch" w="100%">
            <Heading size="md">Login</Heading>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <Text color="red.400">{formik.errors.email}</Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <Text color="red.400">{formik.errors.password}</Text>
              )}
            </FormControl>

            <Button type="submit" colorScheme="yellow">
              Login
            </Button>

            <Text>
              If you do not have an account, please{" "}
              <Link to="/signup" style={{ color: "#ECC94B", textDecoration: "underline" }}>
                signup
              </Link>
            </Text>
          </VStack>
        </form>
      </Container>
    </>
  );
}
const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);
