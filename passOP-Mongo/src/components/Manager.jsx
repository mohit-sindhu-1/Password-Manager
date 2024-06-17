import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid'


const Manager = () => {
    const eyeRef = useRef()
    const passwordRef = useRef()
    const editPasswordRef = useRef({})
    const [form, setForm] = useState({ url: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch('http://localhost:3000/')
        let passwords = await req.json()
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const toggleVisibility = () => {
        if (eyeRef.current.src.includes("/icons/eye.png")) {
            eyeRef.current.src = "/icons/eyecross.png"
            passwordRef.current.type = 'password'
        } else {
            eyeRef.current.src = "/icons/eye.png"
            passwordRef.current.type = 'text'
        }
    }

    const savePassword = async () => {
        if (form.url.length != 0 && form.username.length != 0 && form.password.length != 0) {
            let res = await fetch('http://localhost:3000/', {
                method: 'POST', headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, id: uuidv4() })
            })
            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            setForm({ url: "", username: "", password: "" })
        }
    }

    const updatePassword = async () => {
        document.querySelector("#save").style = "display: flex";
        document.querySelector("#update").style = "display: none";

        if (editPasswordRef.current.url == form.url && editPasswordRef.current.username == form.username && editPasswordRef.current.password == form.password) {
            setForm({ url: "", username: "", password: "" })
            return;
        }


        let index = passwordArray.findIndex(item => {
            return item.id === editPasswordRef.current.id
        })
        let newPasswordArray = [...passwordArray]
        newPasswordArray[index] = { url: form.url, username: form.username, password: form.password, id: editPasswordRef.current.id }
        let res = await fetch('http://localhost:3000/', {
            method: 'PUT', headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPasswordArray[index])
        })
        setPasswordArray(newPasswordArray)

        setForm({ url: "", username: "", password: "" })
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = (text) => {
        navigator.clipboard.writeText(text)
        toast('Copied to Clipboard!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
        });
    }

    const handleEdit = (e) => {
        setForm({ url: e.url, username: e.username, password: e.password })
        editPasswordRef.current = e
        document.querySelector("#save").style = "display: none";
        document.querySelector("#update").style = "display: flex";
    }

    const handleDelete = async (id) => {
        if (confirm('Do you really want to delete this password?')) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            let res = await fetch('http://localhost:3000/', {
                method: 'DELETE', headers: { "Content-Type": "application/json" },
                body: JSON.stringify(passwordArray.filter(item => item.id === id)[0])
            })

        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover={false}
                theme="dark"
            />
            <ToastContainer />

            <div className='lg:w-2/3 md:w-4/5 w-full mx-3 md:mx-auto mt-10'>
                <h1 className='text-4xl font-bold text-center'>
                    <span className="text-cyan-500">&lt;</span>
                    <span>Pass</span>
                    <span className="text-cyan-500">OP/&gt;</span>
                </h1>
                <p className='text-lg text-center'>Your own Password Manager</p>

                <div className='text-white flex flex-col p-4 gap-y-5'>
                    <input value={form.url} onChange={handleChange} placeholder='Enter Website URL' className='border border-cyan-400 px-3 py-1 outline-none text-black rounded-full' type="text" name="url" id="url" />
                    <div className="flex flex-col lg:flex-row lg:gap-x-3 w-full gap-y-5">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='lg:w-3/4 w-full border border-cyan-400 px-3 py-1 outline-none text-black rounded-full' type="text" name="username" id="username" />
                        <div className='lg:w-1/4 w-full relative'>
                            <input value={form.password} ref={passwordRef} onChange={handleChange} placeholder='Enter Password' className='w-full border border-cyan-400 px-3 py-1 outline-none text-black rounded-full' type="password" name="password" id="password" />
                            <img ref={eyeRef} className='absolute right-0 top-0 px-2 py-1.5 cursor-pointer' onClick={toggleVisibility} width={36} src="/icons/eyecross.png" alt="eye" />
                        </div>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <button id='save' onClick={savePassword} className='flex items-center justify-center gap-x-2 py-0.5 px-4 bg-cyan-300 rounded-full hover:bg-cyan-400 border border-cyan-600'>
                        <lord-icon style={{ width: "24px", height: "24px" }} src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover"></lord-icon>
                        <span className='font-bold text-lg'>Save</span>
                    </button>
                    <button id='update' onClick={updatePassword} className='hidden items-center justify-center gap-x-2 py-0.5 px-4 bg-cyan-300 rounded-full hover:bg-cyan-400 border border-cyan-600'>
                        <lord-icon style={{ width: "24px", height: "24px" }} src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover"></lord-icon>
                        <span className='font-bold text-lg'>Update</span>
                    </button>
                </div>

                <div className="passwords mt-6">
                    <h2 className='text-xl font-bold my-2'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No passwords to show</div>}
                    {passwordArray.length !== 0 && <table className='table-auto w-full overflow-hidden rounded-md'>
                        <thead className='bg-cyan-600 text-white'>
                            <tr className='text-left'>
                                <th className='py-2 pl-12'>URL</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-cyan-300 overflow-wrap-anywhere'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className='py-2 md:pl-12 gap-x-2 pl-6 md:w-1/2 px-2 sm:px-0'>
                                        <div className='flex items-center gap-x-2'>
                                            <a className='hover:underline' href={item.url} target='_black'><span>{item.url}</span></a>
                                            <div className='cursor-pointer' onClick={() => { copyText(item.url) }}>
                                                <lord-icon style={{ width: "24px", "paddingTop": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 gap-x-2 px-2 sm:px-0'>
                                        <div className='flex items-center gap-x-2'>
                                            <span>{item.username}</span>
                                            <div className='cursor-pointer' onClick={() => { copyText(item.username) }}>
                                                <lord-icon style={{ width: "24px", "paddingTop": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 gap-x-2 px-2 sm:px-0'>
                                        <div className='flex items-center gap-x-2'>
                                            <span>{"*".repeat(item.password.length)}</span>
                                            <div className='cursor-pointer' onClick={() => { copyText(item.password) }}>
                                                <lord-icon style={{ width: "24px", "paddingTop": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 gap-x-2 w-20 md:w-auto px-2 sm:px-0'>
                                        <div className='flex items-center gap-x-2'>
                                            <div className='cursor-pointer' onClick={() => handleEdit(item)}>
                                                <lord-icon style={{ width: "24px", "paddingTop": "3px" }} src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover"></lord-icon>
                                            </div>

                                            <div className='cursor-pointer' onClick={() => handleDelete(item.id)}>
                                                <lord-icon style={{ width: "24px", "paddingTop": "3px" }} src="https://cdn.lordicon.com/skkahier.json" trigger="hover"></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    }
                </div>
            </div>
        </>
    )
}

export default Manager
