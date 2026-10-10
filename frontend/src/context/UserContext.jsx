import { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";

export const userDataContext = createContext();

export default function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  
  const getCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/currentuser`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      console.log("Error while getting Current User: ", error);
      setUserData(null);
    }
  };
  
  const getPost = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/post/getpost`, {
        withCredentials: true,
      });
      setPostData(result.data);
    } catch (error) {
      console.log("Error getting Post: ", error);
    }
  };
  
  useEffect(() => {
    getCurrentUser();
    getPost();
  }, []);
  
  let value = {
    userData,
    setUserData,
    isEditing,
    setIsEditing,
    postData,
    setPostData,
    getPost,
    getCurrentUser
  };

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}
