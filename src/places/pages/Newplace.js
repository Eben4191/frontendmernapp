import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  Button,
  VStack,
  Heading,
  Center,
  Image,
  Box,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHttpClient } from "../../shared/components/connectbackend/Http-hook";
import ErrorModal from "../../shared/Uti/ErrolModal";
import LoadingSpinner from "../../shared/Uti/LoadingSpinner";
import { AuthContext } from "../../shared/Uti/Auth";
import { useContext, useEffect, useState,  } from "react";
import { useHistory } from "react-router-dom";

export default function Newplace() {
  const [previewUrl, setPreviewUrl] = useState(null)
    const {sendRequest, clearError, error, isLoading} = useHttpClient()
    const auth = useContext(AuthContext)
    const history = useHistory();
  const formik = useFormik({
    initialValues: {
      title: "",
      address: "",
      description: "",
      location: "",
      image: null
    },
    onSubmit: async (values) => {
      try{
        const formData = new FormData()
        formData.append('title', values.title)
        formData.append('address', values.address)
        formData.append('description', values.description)
        formData.append('location', values.location)
        formData.append('image', values.image)
      await sendRequest(`${process.env.REACT_APP_API_URL}/places`, 'POST', formData, 
        {Authorization:'Bearer ' + auth.token} //This line of code send the token received from the signup and login back to the backend to verify if the token is correct if the user identity is valid the auth check file in the middleware folder on the backend will verify this with the custom logic there.
      )
        history.push(`/${auth.userId}/places`);
        
      }catch(err){}
      
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(5, "Must be 15 characters or less")
        .required("Required"),
      address: Yup.string()
        .min(5, "Must be 15 characters or less")
        .required("Required"),
      description: Yup.string().max(100, "Must be 15 characters or less"),
      location: Yup.string().max(100, "Must be 15 characters or less"),
    }),
  });
  useEffect(()=>{
    if(!formik.values.image){
      setPreviewUrl(null)
      return
    }
    const fileReader = new FileReader();
    fileReader.onload = ()=>{
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(formik.values.image)
  }, [formik.values.image]);

  return (
    <>
    <ErrorModal error={error} onClear={clearError}/>
    <Container
      maxW="md"
      py={10}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
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
        {/* Stack to make inputs responsive (column layout) */}
        <VStack
          spacing={6}
          align="stretch"
          w="100%"
          direction={{ base: "column", md: "row" }}
        >
            <Heading as ='h4'> Create a place</Heading>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && (
              <Text color="red.400" fontSize="sm">
                {formik.errors.title}
              </Text>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Address</FormLabel>
            <Input
              id="address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.address && formik.errors.address && (
              <Text color="red.400" fontSize="sm">
                {formik.errors.address}
              </Text>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Cordinates</FormLabel>
            <Input
              id="location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="cordinates in longitude and latitude"
            />
            {formik.touched.location && formik.errors.location && (
              <Text color="red.400" fontSize="sm">
                {formik.errors.location}
              </Text>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description && (
              <Text color="red.400" fontSize="sm">
                {formik.errors.description}
              </Text>
            )}
          </FormControl>
           <FormControl>
                    <VStack spacing={4} align="center">
                      <Box>
                   <Image
                    src={previewUrl}
                    size="xl"
                    name="Profile Image"
                     />
                     </Box>
                 <Input
                    id="image"
                   type="file"
                   display="none"
                   accept="image/jpeg,image/png,image/webp,image/jpg"
                   onChange={(e) => {
                   formik.setFieldValue("image", e.currentTarget.files[0]);
                   }}
                 />
         
                   <Button
                   as="label"
                   htmlFor="image"
                   size="sm"
                   colorScheme="yellow"
                   variant="outline"
                    >
                    Add image of place
                 </Button>
                   </VStack>
                   </FormControl>
          <Button
            type="submit"
            colorScheme='yellow'
            w={{ base: "100%", md: "auto" }}
          >
            Add Place
          </Button>
        </VStack>
      </form>
    </Container>
    </>
  );
}
