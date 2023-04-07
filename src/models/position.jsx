import { createContext, useMemo } from "react";

const PositionContext = createContext({
  getCoordinate: () => {},
});

const BingKey = "AgXLKJqvvaCBQb9-OrR7_pON_UPvsZafaJEPU9LRkXBREwvv3Z6jvilQG1EexTuA";

const PositionContextProvider = ({ children }) => {
  const getCoordinate = async (street, city, state, zipcode) => {
    const countryRegion = "US";
    try {
      const response = await fetch(
        "http://dev.virtualearth.net/REST/v1/Locations/" +
          countryRegion +
          "/" +
          state +
          "/" +
          zipcode +
          "/" +
          city +
          "/" +
          street +
          "?key=" +
          BingKey
      );
      const json = await response.json();
      const latitude = json.resourceSets[0].resources[0].point.coordinates[0];
      const longitude = json.resourceSets[0].resources[0].point.coordinates[1];
      return {
        latitude: latitude,
        longitude: longitude,
      };
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  };

  const contextValue = useMemo(
    () => ({
      getCoordinate,
    }),
    []
  );

  return (
    <PositionContext.Provider value={contextValue}>{children}</PositionContext.Provider>
  );
};

export { PositionContext, PositionContextProvider };
