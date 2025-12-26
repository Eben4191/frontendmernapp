import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Heading,
  Center,
  Avatar,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
  useToast
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { AuthContext } from "../../shared/Uti/Auth";
import { useHttpClient } from "../../shared/components/connectbackend/Http-hook";
import LoadingSpinner from "../../shared/Uti/LoadingSpinner";
import ErrorModal from "../../shared/Uti/ErrolModal";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function Signup() {
  const auth = useContext(AuthContext);
  const { sendRequest, clearError, isLoading, error } = useHttpClient();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      image: null,
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .min(2, "Must be at least 2 characters")
        .required("Required"),
      lastname: Yup.string()
        .min(2, "Must be at least 2 characters")
        .required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("firstname", values.firstname);
        formData.append("lastname", values.lastname);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("image", values.image);

        await sendRequest(
          `/users/signup`,
          "POST",
          formData
        );

        setUserEmail(values.email);
        setEmailSent(true); // show verification input
      } catch (err) {
        console.log(err);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setImageError("File size must be less than 500 KB");
      formik.setFieldValue("image", null);
      setPreviewUrl(null);
      return;
    }

    setImageError("");
    formik.setFieldValue("image", file);

    const fileReader = new FileReader();
    fileReader.onload = () => setPreviewUrl(fileReader.result);
    fileReader.readAsDataURL(file);
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) return setVerificationError("Enter the code");

    try {
      await sendRequest(
        `/users/verify-email`,
        "POST",
        JSON.stringify({ email: userEmail, code: verificationCode }),
        { "Content-Type": "application/json" }
      );

      // Auto-login after verification
      const loginData = await sendRequest(
        `/users/login`,
        "POST",
        JSON.stringify({ email: userEmail, password: formik.values.password }),
        { "Content-Type": "application/json" }
      );

      auth.login(loginData.userId, loginData.token, loginData.userName);
        toast({
         title: "Email verified",
         description: "Your account has been successfully verified.",
         status: "success",
         duration: 3000,
         isClosable: true,
         position: "top"
        });

    } catch (err) {
      setVerificationError(err.message || "Verification failed");
    }
  };

  const handleResendCode = async () => {
    try {
      await sendRequest(
        `/users/resend-verification`,
        "POST",
        JSON.stringify({ email: userEmail }),
        { "Content-Type": "application/json" }
      );
      toast({
      title: "Verification code sent",
      description: "Check your email for the new verification code.",
      status: "success",
      duration: 4000,
     isClosable: true,
     position: "top"
     });
    } catch (err) {
      console.log(err);
     toast({
       title: "Failed to resend code",
       description: err.message || "Something went wrong. Try again.",
       status: "error",
       duration: 4000,
      isClosable: true,
     position: "top"
     });
    }
  };

  // If email sent, show verification input
  if (emailSent) {
    return (
      <Container maxW="sm" py={10}>
        <Heading size="md" textAlign="center" mb={4}>
          Verify Your Email
        </Heading>
        <Text textAlign="center" mb={6}>
          We sent a verification code to <b>{userEmail}</b>. Enter it below.
        </Text>

        <FormControl mb={4}>
          <FormLabel>Verification Code</FormLabel>
          <Input
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter code"
          />
          {verificationError && <Text color="red.400">{verificationError}</Text>}
        </FormControl>

        <HStack spacing={4}>
          <Button colorScheme="yellow" onClick={handleVerifyEmail}>
            Verify
          </Button>
          <Button variant="outline" colorScheme="yellow" onClick={handleResendCode}>
            Resend Code
          </Button>
        </HStack>
      </Container>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Container display="flex" justifyContent="center" alignItems="center" py={10} maxW="md" position="relative">
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
        <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
          <VStack align="stretch" spacing={6}>
            <Heading size="lg" textAlign="center">
              Create an account
            </Heading>

            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                id="firstname"
                name="firstname"
                value={formik.values.firstname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstname && formik.errors.firstname && (
                <Text color="red.400">{formik.errors.firstname}</Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input
                id="lastname"
                name="lastname"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastname && formik.errors.lastname && (
                <Text color="red.400">{formik.errors.lastname}</Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
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
              <InputGroup>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputRightElement>
                  <IconButton
                    size="sm"
                    variant="white"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                </InputRightElement>
              </InputGroup>
              {formik.touched.password && formik.errors.password && (
                <Text color="red.400">{formik.errors.password}</Text>
              )}
            </FormControl>

            <FormControl>
              <VStack spacing={4} align="center">
                <Avatar src={previewUrl} size="xl" name="Profile Image" />
                <Input
                  id="image"
                  type="file"
                  display="none"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageChange}
                />
                {imageError && <Text color="red.400">{imageError}</Text>}
                <Button as="label" htmlFor="image" size="sm" colorScheme="yellow" variant="outline">
                  Pick Profile Image
                </Button>
              </VStack>
            </FormControl>

            <Button type="submit" colorScheme="yellow" disabled={!!imageError}>
              Signup
            </Button>
          </VStack>
        </form>
      </Container>
    </>
  );
}
