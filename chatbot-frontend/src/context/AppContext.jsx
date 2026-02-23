import { Children, createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = ({ children })=>{

    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    const fetchUser = async () => {
        setUser(dummyUserData)
    }

    const fetchUsersChats = async () => {
        setChats(dummyChats)
        setSelectedChat(dummyChats[0])
    }

    useEffect(()=>{
        if(user){
            fetchUsersChats()
        }
        else{
            setChats([])
            setSelectedChat(null)
        }
    },[user])

    useEffect(()=>{
        fetchUser()
    },[])

    const value = {
        navigate, user, setUser, fetchUser, chats,setChats,selectedChat,setSelectedChat
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext);