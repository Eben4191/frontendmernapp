import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useHttpClient } from "../../shared/components/connectbackend/Http-hook";
import ErrorModal from "../../shared/Uti/ErrolModal";
import LoadingSpinner from "../../shared/Uti/LoadingSpinner";
import { AuthContext } from "../../shared/Uti/Auth";
export default function Updateplace() {
  const placeId = useParams().pid
  const {sendRequest, clearError, error, isLoading} = useHttpClient()
  const [loadedPlaces, setLoadedPlaces] = useState()
  const auth = useContext(AuthContext)
  const history = useHistory()
  useEffect(() =>{
    const fetchPlaces = async () =>{
      try{
       const response =  await sendRequest(`${process.env.REACT_APP_API_URL}/places/${placeId}`)
        setLoadedPlaces(response.place);
      }catch(err){}
    }
    fetchPlaces()
  },[sendRequest, placeId])
  const formik = useFormik({
  enableReinitialize: true,
  initialValues: {
    title: loadedPlaces ? loadedPlaces.title : "",
    description: loadedPlaces ? loadedPlaces.description : "",
  },
    onSubmit: async (values) => {
      try{
        await sendRequest(`${process.env.REACT_APP_API_URL}/places/${placeId}`, 'PATCH', JSON.stringify({
          title: values.title,
          description: values.description
        }), {'Content-Type': 'application/json', Authorization:'Bearer ' + auth.token}) //This code send the token back to the backend for user identity verification before further granting the update approval note bearer is included in the token just for convention purposes it does not serve any purpose  the token is passed in via the auth context according the logic written on the app.js component.

        history.push(`/${auth.userId}/places`) //This will redirect us to the places page after updating the page
      }catch(err){}
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(5, "Must be 5 character or more")
        .required("Required"),
      description: Yup.string().min(
        5,
        "Must not be less than 5 characters in length"
      ),
    }),
  });

  return (
    <>
    <ErrorModal error={error} onClear={clearError}/>
    <Container
       display="flex"
        justifyContent="center"
        alignItems="center"
        py={10}
        maxW="md"
        position="relative"
    >
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
         
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <VStack
          spacing={6}
          align="stretch"
          w="100%"
          direction={{ base: "column", md: "row" }}
        >
          <Heading size="lg">Update Place</Heading>

          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && (
              <Text color="red.400">{formik.errors.title}</Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description && (
              <Text color="red.400">{formik.errors.description}</Text>
            )}
          </FormControl>

          <Button type="submit" colorScheme="yellow">
            Update
          </Button>
        </VStack>
      </form>
    </Container>
    </>
  );
}
