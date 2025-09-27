'use client'
import { createContext, useContext, useState } from "react"
import Pagee, { QuestCard } from "./page"

const UserContext = createContext()
export const UserProvider = ({children}) => {
const [refresh, setRefresh] = useState(false)
  return (
    <div>
    <UserContext.Provider value={{refresh, setRefresh}}>
       {children}
      </UserContext.Provider>
    </div>
  )
}
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};

