import { Box, Center } from "@chakra-ui/react"
import PlaceList from "../component/PlaceList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/components/connectbackend/Http-hook";
import ErrorModal from "../../shared/Uti/ErrolModal";
import LoadingSpinner from "../../shared/Uti/LoadingSpinner";
export default function Place() {
  const userId = useParams().userid
  const {error, isLoading, clearError, sendRequest} = useHttpClient();
  const [loadedPlaces,setLoadedPlaces] = useState()
 useEffect(() =>{
  const fetchPlaces = async () =>{
    try{
      const responseData = await sendRequest(`${process.env.REACT_APP_API_URL}/places/user/${userId}`)
       setLoadedPlaces(responseData.places)
    }catch(err){}
  }
  fetchPlaces()
 }, [sendRequest,userId])
 
const onDeletePlaceHandler = (deletedPlaceId) => {
  setLoadedPlaces(prevPlaces =>
    prevPlaces.filter(place => place.id !== deletedPlaceId)
  );
};


  return (
    <>
    <ErrorModal error={error} onClear={clearError}/>
     <Box position="relative" minH="50vh">
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
   
           {!isLoading && loadedPlaces && (
             <PlaceList items={loadedPlaces} onDelete={onDeletePlaceHandler} />
           )}
         </Box>
    </>
  )
}
