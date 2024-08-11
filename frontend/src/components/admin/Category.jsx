import { useState, useEffect } from 'react'
// TOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BiTrash } from 'react-icons/bi';
import Loader from '../Loader';

import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";

import { CiCirclePlus } from "react-icons/ci";
import { MdDashboard } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import { LiaCalendarWeekSolid } from "react-icons/lia";
import { SiVirustotal } from "react-icons/si";

const Category = () => {

    const [categories, setCategories] = useState([]);
    const [totalCategory, setTotalCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [categoryId, setCategoryId] = useState('');
    const [lastWeekCategoryCount, setLastWeekCategoryCount] = useState('');
    const [lastMonthCategoryCount, setLastMonthCategoryCount] = useState('');

    const handleFetchCategories = async () => {
        try {
            const res = await fetch('/api/category/getAllCategories', {
                method: "GET",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setCategories(data.allCategories);
                setTotalCategory(data.totalCategory);
                setLastMonthCategoryCount(data.lastMonthCategoryCount);
                setLastWeekCategoryCount(data.lastWeekCategoryCount);
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        handleFetchCategories();
    }, []);


    // EDIT CATEGORY

    const [openModal, setOpenModal] = useState(false);

    const [formData, setFormData] = useState({});
    const [eachCategory, setEachCategory] = useState({});
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleFetchSingleCategory = async (categoryId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/category/getEachCategory/${categoryId}`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setEachCategory(data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        if (eachCategory) {
            setName(eachCategory.name);
            setTitle(eachCategory.title);
            setDescription(eachCategory.description);
        }
    }, [eachCategory])

    const removeDesc = (index) => {
        setDescription((prevDesc) => prevDesc.filter((_, id) => id !== index))
    }

    const [descInput, setDescInput] = useState('');

    const handleInputDesc = (e) => {
        setDescInput(e.target.value)
    }

    const handlAddDesc = () => {
        if (descInput.trim()) {
            setDescription([...description, descInput.trim()]);
            setDescInput('');
        }
    }

    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleShowSucccessMessage = (message) => {
        toast.success(message)
    }

    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);
        const updateForm = {};
        if (!formData.name) updateForm.name = formData.name;
        if (!formData.title) updateForm.title = formData.title;
        if (description.length > 0) updateForm.description = description;

        try {
            const res = await fetch(`/api/category/update/${categoryId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateForm)
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Update category failed");
                return;
            } else {
                setLoadingUpdate(false);
                handleShowSucccessMessage("Update category successfully");
                setOpenModal(false);
                setCategoryId('');
                handleFetchCategories();
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDeleteCategory = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/category/delete/${categoryId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Delete category failed");
                return;
            } else {
                handleShowSucccessMessage("Delete category successfully");
                setCategoryId('');
                setOpenDeleteModal(false);
                handleFetchCategories();
            }
        } catch (error) {
            console.log(error.messasge)
        }
    }

    // CREATE

    const [openCreateCategory, setOpenCreateCategory] = useState(false);
    const [createDesc, setCreateDesc] = useState([]);
    const [formCreate, setFormCreate] = useState({});
    const [inputCreateDesc, setInputCreateDesc] = useState('');
    const [loadingCreate, setLoadingCreate] = useState(false);

    const handleInputCreateDesc = (e) => {
        setInputCreateDesc(e.target.value)
    }

    const handleAddCreateDesc = () => {
        if (inputCreateDesc.trim()) {
            setCreateDesc([...createDesc, inputCreateDesc.trim()]);
            setInputCreateDesc('');
        }
    }

    const handleRemoveCreateDesc = (index) => {
        setCreateDesc((prevDesc) => prevDesc.filter((_, id) => id !== index))
    }

    const handleChangeCreate = (e) => {
        setFormCreate({ ...formCreate, [e.target.id]: e.target.value });
    }

    const handleCreateForm = async (e) => {
        e.preventDefault();
        setLoadingCreate(true);
        try {
            const res = await fetch(`/api/category/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formCreate.name,
                    title: formCreate.title,
                    description: createDesc
                })
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Create category failed");
                return;
            } else {
                handleShowSucccessMessage("Create category successfully");
                setOpenCreateCategory(false);
                handleFetchCategories();
                setFormCreate({});
                setCreateDesc([]);
                setLoadingCreate(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }



    return (
        <div className='py-[20px] px-[40px] max-md:px-[10px] h-full overflow-y-scroll bg-gray-100'>
            <>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <div className='flex justify-between max-md:flex-col max-md:flex-start max-md:my-[20px]'>
                            <div className='flex gap-[20px] items-center'>
                                <MdDashboard className='text-[30px]' />
                                <h1 className='font-semibold text-[20px] max-md:text-[18px]'>Category Dashboard</h1>
                            </div>
                            <div className='flex gap-[20px] items-center max-md:flex-col max-md:items-start'>
                                <div onClick={() => setOpenCreateCategory(true)} className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
                                    <CiCirclePlus className='text-[20px]' />
                                    <p className='text-[16px]'>Create category</p>
                                </div>
                                <div className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
                                    <IoIosPrint className='text-[20px]' />
                                    <p className='text-[16px]'>Print Excel</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-[10px] items-center'>
                            <FaBusinessTime className='text-[20px]' />
                            <h3 className='text-[16px] font-semibold'>Business Overview</h3>
                        </div>

                        <div className='flex max-md:flex-wrap justify-center max-md:justify-start items-center gap-[20px] py-[30px]'>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <SiVirustotal className='text-[20px]' />
                                    <span>Total category: </span>
                                </div>
                                <p>{totalCategory}</p>
                            </div>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <LiaCalendarWeekSolid className='text-[20px]' />
                                    <span>Last week create: </span>
                                </div>
                                <p>{lastWeekCategoryCount}</p>
                            </div>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <MdCalendarMonth className='text-[20px]' />
                                    <span>Last month create: </span>
                                </div>
                                <p>{lastMonthCategoryCount}</p>
                            </div>
                        </div>

                        <div className='flex gap-[10px] items-center'>
                            <MdCategory className='text-[20px]' />
                            <h3 className='text-[16px] font-semibold'>All Categories</h3>
                        </div>

                        <div className='border rounded-[20px] mt-[20px] p-[10px] bg-white'>
                            {categories?.map((category, index) => (
                                <div key={index} className='border-b-[2px] py-[40px] flex flex-col gap-[20px]'>

                                    {/* name+title */}
                                    <div className='flex gap-[20px]'>
                                        <p className='font-semibold w-[100px]'>Name:</p>
                                        <p>{category.name}</p>
                                    </div>
                                    <div className='flex gap-[20px]'>
                                        <p className='font-semibold w-[100px]'>Title:</p>
                                        <p>{category.title}</p>
                                    </div>

                                    {/* description */}
                                    <div className='flex flex-col'>
                                        <p className='font-semibold w-[100px]'>Description: </p>
                                        <div className='flex flex-wrap gap-[20px] w-[full] mt-[20px]'>
                                            {category.description?.map((item, index) => (
                                                <div key={index} className='relative p-[10px] rounded-[5px] w-[160px] bg-red-50'>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='flex gap-[50px]'>
                                        <button onClick={() => { setOpenModal(true); setCategoryId(category._id); handleFetchSingleCategory(category._id) }} type='submit' className='rounded-[30px] bg-blue-400 text-white w-[160px] p-[10px] hover:bg-opacity-70'>Edit</button>
                                        <button onClick={() => { setOpenDeleteModal(true); setCategoryId(category._id) }} className='rounded-[30px] bg-red-400 text-white w-[160px] p-[10px] hover:bg-opacity-70'>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </>

            {/* CREATE */}
            <Modal
                open={openCreateCategory}
                onClose={() => setOpenCreateCategory(false)}
            >
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[600px] max-md:w-[400px] bg-white text-black h-[500px] overflow-y-scroll rounded-[20px] flex flex-col gap-[20px] p-[20px] max-md:p-[10px] '>
                    {loadingCreate ? (
                        <Loader />
                    ) : (
                        <>
                            <IoIosCloseCircleOutline onClick={() => setOpenCreateCategory(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                            <h2 className='text-center text-[20px] font-semibold'>Create New Category</h2>
                            <form onSubmit={handleCreateForm} className='flex flex-col gap-[20px]'>
                                <div className='flex max-md:flex-col gap-[20px]'>
                                    <p className='w-[160px] font-semibold'>Name:</p>
                                    <input onChange={handleChangeCreate} type="text" id='name' placeholder='Enter category name' className='border-[2px] border-black border-dotted px-[10px]' />
                                </div>
                                <div className='flex max-md:flex-col gap-[20px]'>
                                    <p className='w-[160px] font-semibold'>Title:</p>
                                    <input onChange={handleChangeCreate} type="text" id='title' placeholder='Enter title name' className='border-[2px] border-black border-dotted px-[10px]' />
                                </div>
                                <div className='flex max-md:flex-col gap-[20px]'>
                                    <p className='w-[160px] font-semibold'>Description:</p>
                                    <input onChange={handleInputCreateDesc} value={inputCreateDesc} type="text" id='title' placeholder='Enter descriptions' className='border-[2px] border-black border-dotted px-[10px]' />
                                    <div onClick={handleAddCreateDesc} className='rounded-[10px] bg-black text-white hover:opacity-70 py-[3px] px-[10px] cursor-pointer w-[100px] text-center'>Add</div>
                                </div>
                                <div className='flex flex-wrap gap-[20px] w-[full] mt-[20px]'>
                                    {createDesc?.map((item, index) => (
                                        <div key={index} className='relative p-[10px] rounded-[5px] w-[160px] bg-red-50'>
                                            {item}
                                            <BiTrash onClick={() => handleRemoveCreateDesc(index)} className='absolute top-[5px] right-[5px] hover:text-red-400 cursor-pointer' />
                                        </div>
                                    ))}
                                </div>
                                <button type='submit' className='rounded-[30px] w-[200px] text-center p-[10px] mt-[50px] bg-red-400 text-white hover:opacity-70'>Save</button>
                            </form>
                        </>
                    )}
                </div>
            </Modal>

            {/* EDIT */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[1000px] max-md:w-[400px] bg-white text-black h-[500px] rounded-[20px] '>
                    <IoIosCloseCircleOutline onClick={() => setOpenModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                    <form onSubmit={handleSubmitForm} className='p-[20px] max-md:p-[10px]'>
                        {loadingUpdate ? (
                            <Loader />
                        ) : (
                            <>
                                <h2 className='text-center text-[20px] font-semibold'>Edit Category</h2>
                                {loading ? (<Loader />) : (
                                    <div className='flex flex-col gap-[20px] mt-[20px]'>
                                        <div className='flex max-md:flex-col gap-[20px]'>
                                            <p className='w-[160px] font-semibold'>Name: </p>
                                            <input onChange={handleChange} type="text" value={name} id='name' className='border-gray-500 border-[2px] border-dashed px-[10px] ' />
                                        </div>
                                        <div className='flex max-md:flex-col gap-[20px]'>
                                            <p className='w-[160px] font-semibold'>Title: </p>
                                            <input onChange={handleChange} type="text" value={title} id='title' className='border-gray-500 border-[2px] border-dashed px-[10px] ' />
                                        </div>
                                        <div className='flex max-md:flex-col flex-col'>
                                            <div className='flex max-md:flex-col items-center max-md:items-start gap-[20px]'>
                                                <p className='w-[160px] font-semibold'>Description: </p>
                                                <input onChange={handleInputDesc} value={descInput} type="text" placeholder='Enter here' id='description' className='border-gray-500 border-[2px] border-dashed px-[10px] ' />
                                                <div onClick={handlAddDesc} className='rounded-[10px] bg-black text-white hover:opacity-70 py-[3px] px-[10px] cursor-pointer'>Add</div>
                                            </div>
                                            <div className='flex flex-wrap gap-[20px] w-[full] mt-[20px]'>
                                                {description?.map((item, index) => (
                                                    <div key={index} className='relative p-[10px] rounded-[5px] w-[160px] bg-red-50'>
                                                        {item}
                                                        <BiTrash onClick={() => removeDesc(index)} className='absolute top-[5px] right-[5px] hover:text-red-400 cursor-pointer' />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button type='submit' className='rounded-[30px] w-[200px] text-center p-[10px] bg-red-400 text-white hover:opacity-70'>Save</button>
                                    </div>
                                )}
                            </>
                        )}
                    </form>
                </div>

            </Modal>

            {/* DELETE */}
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[400px] bg-white text-black h-[300px] max-md:h-[200px] rounded-[20px] flex flex-col gap-[20px] justify-center items-center '>
                    <IoIosCloseCircleOutline onClick={() => setOpenDeleteModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                    <h3 className='text-center text-[20px] max-md:text-[16px]'>Are you sure to delete this category ?</h3>
                    <div className='flex justify-evenly w-full'>
                        <div onClick={handleDeleteCategory} className='rounded-[10px] p-[10px] text-center bg-red-400 hover:opacity-70 w-[100px] cursor-pointer'>YES</div>
                        <div onClick={() => setOpenDeleteModal(false)} className='rounded-[10px] p-[10px] text-center bg-blue-400 hover:opacity-70 w-[100px] cursor-pointer'>CANCEL</div>
                    </div>
                </div>
            </Modal>

        </div>
    )
}

export default Category