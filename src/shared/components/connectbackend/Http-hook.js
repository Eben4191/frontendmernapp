import { useCallback, useEffect, useRef, useState } from "react"

export const useHttpClient = ()=>{
    const [error, setError] = useState()
    const [isLoading,setIsLoading] = useState(false)

    const activeHttpRequests = useRef([]);


    const sendRequest = useCallback(async (url, method='GET', body=null, headers={} ) => {
        //this abortctrl helps the webapp to cancel httprequest when the user probably leave the webapp or go to another place on the webapp.
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
         setIsLoading(true)
        try{
      const response =  await fetch(url,{
            method,
            body,
            headers,
            signal: httpAbortCtrl.signal //this line of code links the abortcrl to this request.
        })
        const responseData =  await response.json()
        //clear old request crtl
        activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);

        if (!response.ok){
            throw new Error(responseData.message)
        }
        setIsLoading(false)
        return responseData;
        }catch(err){
            if (err.name === "AbortError") {
                 return; // do nothing
               }
            setError(err.message);
            setIsLoading(false); 
            throw err;
        }  
    
    }, []);
    
    const clearError = () => {
        setError(null);
    }

    useEffect(()=> {
        //this return function we serve as a cleanup function anytime the component that is using our custom hook reload
        return () => {
            activeHttpRequests.current.forEach(abortCtrl=> abortCtrl.abort());
        };
    }, []);

    return {sendRequest, error, isLoading, clearError};
}