import axios from "axios"

export const importCollection = async (data) => {
    console.log(data)
    const res = await axios.post('https://deoapp-backend-awfnqqp6oq-et.a.run.app/import-collection', data
    )
    return res
}

export const exportCollection = async (data) => {
    const res = await axios.post('https://deoapp-backend-awfnqqp6oq-et.a.run.app/export-collection', data
    )
    return res
}

export const exportSubcollection = async (data) => {
    const res = await axios.post('https://deoapp-backend-awfnqqp6oq-et.a.run.app/export_subcollection', data
    )
    return res
}