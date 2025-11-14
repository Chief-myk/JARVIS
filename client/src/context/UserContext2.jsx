import React, { createContext, useState } from 'react'
export const dataContext = createContext()

export let user={
    data: null,
    mime_type : null,
    imgUrl:null
}

export let prevUser={
    data: null,
    mime_type : null,
    prompt: null,
    imgUrl:null
}
function UserContext2({children}) {
    let [startRes, setStartRes] = useState(false)
    let [popUp, setPopUp] = useState(false)
    let [input, setInput] = useState("")
    let [feature, setFeature] = useState("chat")
    let [showResult,setShowResult] = useState("")
    let [prevFeature, setPrevFeature] = useState("chat")
    let [genImgUrl,setGenImgUrl] = useState("")
    let [user, setUser] = useState({
        data: null,
        mime_type: null,
        imgUrl: null
    })

    let [prevUser, setPrevUser] = useState({
        data: null,
        mime_type: null,
        prompt: null,
        imgUrl: null
    })

    let value = {
        startRes, setStartRes,
        popUp, setPopUp,
        input, setInput,
        feature, setFeature,
        showResult, setShowResult,
        prevFeature, setPrevFeature,
        genImgUrl, setGenImgUrl,
        user, setUser,
        prevUser, setPrevUser
    }

    return (
    <div>
        <dataContext.Provider value={value}>
        {children}
        </dataContext.Provider>
    </div>
  )
}

export default UserContext2