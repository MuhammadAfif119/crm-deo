import React, { useEffect } from 'react'
import store from 'store'
import ApiBackend from '../Api/ApiBackend';


function ReportsPage() {

    const getAnalytics = async () => {
        const res = await store.get("userData");
        const profileKey = res?.ayrshare_account?.profileKey

        if(profileKey){
            try {
                const res = await ApiBackend.post('/analyticslinks', {
                    lastDays : 1,
                    profileKey
                })
                console.log(res, 'ini res')
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getAnalytics()
    
      return () => {
      }
    }, [])
    
  return (
    <div>ReportsPage</div>
  )
}

export default ReportsPage