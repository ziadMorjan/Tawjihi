//axios
import axios from "axios";
// react
import { useEffect, useState } from "react"

export const useApi = (url)=>{

    const [data  ,setData] = useState([]);
    const [isLoading , setIsLoading] =useState(false)
    const [error , setError] = useState('')

    useEffect(()=>{
        const fetchData = async ()=>{
           try{
            setIsLoading(true)
            const res = await axios.get(url)
            console.log(res)
            // setData(res.data)
        }catch(e){
            setError(e.message)
        }finally{
            setIsLoading(false)
        }
           }
           fetchData()
    },[url])

    return {data , isLoading , error}
}