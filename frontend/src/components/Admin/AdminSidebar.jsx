
import { MoreVertical, ChevronLast, ChevronFirst, ListOrdered, CarFront, ShoppingCart, Tag, PersonStanding, BookDashed, DatabaseBackup, PenBox, Settings, Ticket, BathIcon, MessageCircle, Ship, ShipWheel, Plane, PlaneIcon, DollarSign, DollarSignIcon, BadgeDollarSign, WashingMachine, Monitor } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useContext, createContext, useState } from "react"

// const SidebarContext = createContext()

export default function AdminSidebar() {
  const [expanded, setExpanded] = useState(true)

  
  const toggleSidebar = () => {
    setExpanded(!expanded)
  }
  
  return (
    <>
   <div className={`h-auto  ${expanded ? 'w-[15%]' : 'w-[5%]'} bg-white border-2 border-neutral-200  flex flex-col justify-top pt-5 transition-width duration-300`}>   
   <button onClick={toggleSidebar} className="self-end mr-5">
          {expanded ? <ChevronFirst /> : <ChevronLast />}
        </button>
        <div className="text-left  px-5 text-neutral-700 spacing-2  text-xs font-semibold">
            <NavLink className={
          expanded ? 'block' : 'hidden'
        } href='/'>
                    Navigation
            </NavLink>
        </div>
        <NavLink to='/admin'>
        <div className="text-sm mt-10 px-5 py-2 hover:bg-[#b7c0cd] spacing-2 hover:text-black text-black font-medium text-left mx-2  rounded-lg flex flex-row gap-3 items-center">
       

        <span><BookDashed/></span> 
        <div className={
          expanded ? 'block' : 'hidden'
        }>
        Overview
        </div>
        
     
        </div>
        </NavLink>
        <NavLink to='/admin/pos'>
        <div className="text-sm  px-5 py-2 hover:bg-[#b7c0cd] spacing-2 hover:text-black text-black font-medium text-left mx-2 rounded-lg flex flex-row gap-3 items-center">
           
        <span><Monitor/></span> 
        <div className={
          expanded ? 'block' : 'hidden'
        }>
        POS
        </div>
         
        </div>
        </NavLink>
            <NavLink to='/admin/orders'>
        <div className="text-sm  px-5 py-2 hover:bg-[#b7c0cd] spacing-2 hover:text-black text-black font-medium text-left mx-2 rounded-lg flex flex-row gap-3 items-center">
           
        <span><ShoppingCart/></span> 
        <div className={
          expanded ? 'block' : 'hidden'
        }>
        Orders
        </div>
         
        </div>
        </NavLink>
        <NavLink to='/admin/Products'>
        <div className="text-sm  px-5 py-2 hover:bg-[#b7c0cd] spacing-2 hover:text-black text-black font-medium text-left mx-2 rounded-lg flex flex-row gap-3 items-center">
          
        <span><Tag/></span>  

        <div className={
          expanded ? 'block' : 'hidden'
        }>
        Inventory
          </div>
     
        </div>
        </NavLink>
        <NavLink to='/admin/transaction'>
        <div className="text-sm  px-5 py-2 hover:bg-[#b7c0cd] spacing-2 hover:text-black text-black font-medium text-left mx-2 rounded-lg flex flex-row gap-3 items-center">
          
        <span><PersonStanding/></span>

        <div className={
          expanded ? 'block' : 'hidden'
        }>
        Transaction
          </div>
     
        </div>
        </NavLink>
      
        <NavLink to='/admin/notification'>
        <div className="text-sm  px-5 py-2 hover:bg-[#b7c0cd] spacing-2 hover:text-black text-black font-medium text-left mx-2 rounded-lg flex flex-row gap-3 items-center">
          
        <span><MessageCircle/></span>

        <div className={
          expanded ? 'block' : 'hidden'
        }>
        Notifications
          </div>
      
        </div>
        </NavLink>
        <NavLink to='/admin/settings'>
        <div className="text-sm  px-5 py-2 hover:bg-[#b7c0cd] spacing-2 hover:text-black text-black font-medium text-left mx-2  rounded-lg flex flex-row gap-3 items-center">
          
        <span><Settings/></span>

        <div className={
          expanded ? 'block' : 'hidden'
        }>
        Settings
          </div>
      
        </div>
        </NavLink>
   </div>
    </>
  )
}