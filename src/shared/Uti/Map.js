import React, { useRef, useEffect, useState } from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";
import "ol/ol.css";
import MapOL from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";

const Map = ({ center, zoom }) => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new MapOL({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([center.lng, center.lat]),
        zoom,
      }),
    });

    setTimeout(() => {
      map.updateSize();
      setLoading(false);
    }, 600);

    return () => map.setTarget(null);
  }, [center, zoom]);

  return (
    <Box
      position="relative"
      w="100%"
      h={{ base: "250px", md: "400px" }}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      bg="gray.800"
    >
      <Box ref={mapRef} w="100%" h="100%" />
      {loading && (
        <Center position="absolute" top="0" left="0" w="100%" h="100%" bg="rgba(0,0,0,0.3)">
          <Spinner size="xl" color="yellow.300" thickness="4px" />
        </Center>
      )}
    </Box>
  );
};

export default Map;
