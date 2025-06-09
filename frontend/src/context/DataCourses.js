import { createContext, useState } from "react";

export const DataCourses = createContext();

export const DataCoursesProvider = ({ children }) => {
  const [dataCourses, setDataCourses] = useState([]);
 
  return (
    <DataCourses.Provider value={{ dataCourses, setDataCourses }}>
      {children}
    </DataCourses.Provider>
  );
};
