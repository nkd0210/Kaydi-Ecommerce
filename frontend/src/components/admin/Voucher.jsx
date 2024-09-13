import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
import VoucherCard from '../VoucherCard';
import { CiEdit } from "react-icons/ci";
import DataTable from 'react-data-table-component';

const Voucher = () => {

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [loadingVoucher, setLoadingVoucher] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [totalVoucher, setTotalVoucher] = useState('');
    const [lastWeekVouchers, setLastWeekVouchers] = useState('');
    const [lastMonthVouchers, setLastMonthVouchers] = useState('');

    const [allVouchers, setAllVouchers] = useState([]);

    const fetchAllVouchers = async () => {
        setLoadingVoucher(true);
        try {
            const res = await fetch(`/api/voucher/getAllVouchers/${currentUser._id}`, {
                method: "GET"
            })
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllVouchers(data.vouchers);
                setTotalVoucher(data.totalVouchers);
                setLastMonthVouchers(data.lastMonthVouchersCount);
                setLastWeekVouchers(data.lastWeekVouchersCount);
                setLoadingVoucher(false);
            }
        } catch (error) {
            console.log(error.message);
        }
        finally {
            setLoadingVoucher(false);
        }
    }

    useEffect(() => {
        fetchAllVouchers();
    }, []);

    // create voucher
    const [productApplyInput, setProductApplyInput] = useState([]);
    const [productApply, setProductApply] = useState([]);
    const [categoryApplyInput, setCategoryApplyInput] = useState([]);
    const [categoryApply, setCategoryApply] = useState([]);

    const handleChangeFormCreate = (e) => {
        setFormCreate({ ...formCreate, [e.target.id]: e.target.value })
    }

    const handleInputCreateProduct = (e) => {
        setProductApplyInput(e.target.value)
    }

    const handleInputCreateCategory = (e) => {
        setCategoryApplyInput(e.target.value)
    }

    const handleAddCreateProduct = () => {
        if (productApplyInput.trim()) {
            setProductApply([...productApply, productApplyInput.trim()]);
            setProductApplyInput('');
        }
    }

    const handleAddCreateCategory = () => {
        if (categoryApplyInput.trim()) {
            setCategoryApply([...categoryApply, categoryApplyInput.trim()]);
            setCategoryApplyInput('');
        }
    }

    const handleRemoveCreateProduct = (index) => {
        setProductApply((prevProduct) => prevProduct.filter((_, id) => id !== index))
    }

    const handleRemoveCreateCategory = (index) => {
        setCategoryApply((prevCategory) => prevCategory.filter((_, id) => id !== index))
    }

    const [allProducts, setAllProducts] = useState([]);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [productModal, setProductModal] = useState(false);

    const fetchAllProducts = async () => {
        setLoadingProduct(true);
        try {
            const res = await fetch(`/api/product/getAllProduct`, {
                method: "GET",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllProducts(data.allProducts);
                setLoadingProduct(false);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingProduct(false);
        }
    }

    useEffect(() => {
        if (productModal === true) {
            fetchAllProducts();
        }
    }, [productModal])

    const selectProduct = (productId) => {
        setProductApply([...productApply, productId]);
    }

    const [allCategories, setAllCategories] = useState([]);
    const [categoryModal, setCategoryModal] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);

    const fetchAllCategories = async () => {
        setLoadingCategory(true);
        try {
            const res = await fetch(`/api/category/getAllCategories`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllCategories(data.allCategories);
                setLoadingCategory(false);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingCategory(false);
        }
    }

    useEffect(() => {
        if (categoryModal === true) {
            fetchAllCategories();
        }
    }, [categoryModal]);

    const selectCategory = (categoryId) => {
        setCategoryApply([...categoryApply, categoryId]);
    }

    const [formCreate, setFormCreate] = useState({});
    const [loadingCreate, setLoadingCreate] = useState(false);

    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleShowSucccessMessage = (message) => {
        toast.success(message)
    }

    const handleSubmitCreateForm = async (e) => {
        e.preventDefault();
        setLoadingCreate(true);
        const createForm = {
            code: formCreate.code,
            discount: formCreate.discount,
            expiryDate: formCreate.expiryDate,
            usageLimit: formCreate.usageLimit,
            applyProducts: productApply,
            applyCategories: categoryApply
        }
        try {
            if (!createForm.code || !createForm.discount || !createForm.expiryDate || !createForm.usageLimit) {
                handleShowErrorMessage("Please fill the field required");
                return;
            }

            const res = await fetch(`/api/voucher/create/${currentUser._id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createForm)
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Create voucher failed! Try again");
                return;
            } else {
                handleShowSucccessMessage("Create voucher successfully");
                setFormCreate({});
                setProductApply([]);
                setCategoryApply([]);
                setLoadingCreate(false);
                fetchAllVouchers();
                setOpenCreateModal(false);
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoadingCreate(false);
        }
    }

    // EDIT VOUCHER
    const columns = [
        { name: 'Code', selector: row => row.code },
        { name: 'Discount', selector: row => row.discount, sortable: true },
        { name: 'Expiry Date', selector: row => new Date(row.expiryDate).toLocaleDateString('en-GB'), sortable: true },
        { name: 'Usage Limit', selector: row => row.usageLimit, sortable: true },
        { name: 'Used  Count', selector: row => row.usedCount, sortable: true },
        { name: 'Apply Product', selector: row => row.applyProducts.join(', ') },
        { name: 'Apply Category', selector: row => row.applyCategories.join(', ') }
    ];

    const [editVoucherModal, setEditVoucherModal] = useState(false);
    const [editVoucherId, setEditVoucherId] = useState('');
    const [loadingEditVoucher, setLoadingEditVoucher] = useState(false);
    const [prevVoucher, setPrevVoucher] = useState({}); // contain the voucher before update

    const handleRowClick = (id) => {
        setEditVoucherModal(true);
        setEditVoucherId(id);
        fetchVoucherById(id);
    }

    const fetchVoucherById = async (editVoucherId) => {
        setLoadingEditVoucher(true)
        try {
            const res = await fetch(`/api/voucher/getVoucherById/${currentUser._id}/${editVoucherId}`, {
                method: "GET",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                const formattedData = {
                    ...data,
                    expiryDate: data.expiryDate ? data.expiryDate.split('T')[0] : ''
                };
                setPrevVoucher(formattedData);
                setLoadingEditVoucher(false);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingEditVoucher(false);
        }
    }

    const [productEditInput, setProductEditInput] = useState([]); // input field for product
    const [categoryEditInput, setCategoryEditInput] = useState([]); // input field for category
    const [productApplyEdit, setProductApplyEdit] = useState([]); // show product
    const [categoryApplyEdit, setCategoryApplyEdit] = useState([]); // show category

    useEffect(() => {
        if (prevVoucher) {
            setProductApplyEdit(prevVoucher.applyProducts);
            setCategoryApplyEdit(prevVoucher.applyCategories)
        }
    }, [prevVoucher])

    const handleInputEditProduct = (e) => {
        setProductEditInput(e.target.value);
    }

    const handleInputEditCategory = (e) => {
        setCategoryEditInput(e.target.value);
    }

    const handleAddEditProduct = () => {
        if (productEditInput.trim()) {
            setProductApplyEdit([...productApplyEdit, productEditInput.trim()]);
            setProductEditInput('');
        }
    }

    const handleAddEditCategory = () => {
        if (categoryEditInput.trim()) {
            setCategoryApplyEdit([...categoryApplyEdit, categoryEditInput.trim()]);
            setCategoryEditInput('');
        }
    }

    const handleRemoveEditProduct = (index) => {
        setProductApplyEdit((prevProduct) => prevProduct.filter((_, id) => id !== index))
    }

    const handleRemoveEditCategory = (index) => {
        setCategoryApplyEdit((prevCategory) => prevCategory.filter((_, id) => id !== index))
    }

    const selectProductEdit = (productId) => {
        setProductApplyEdit([...productApplyEdit, productId]);
    }

    const selectCategoryEdit = (categoryId) => {
        setCategoryApplyEdit([...categoryApplyEdit, categoryId]);
    }

    const [formEdit, setFormEdit] = useState([]);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleEditFormChange = (e) => {
        setFormEdit({ ...formEdit, [e.target.id]: e.target.value })
    }

    const handleSubmitEditForm = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);

        const editForm = {};

        if (formEdit?.code) editForm.code = formEdit.code;
        if (formEdit?.discount) editForm.discount = formEdit.discount;
        if (formEdit?.expiryDate) editForm.expiryDate = formEdit.expiryDate;
        if (formEdit?.usageLimit) editForm.usageLimit = formEdit.usageLimit;
        if (productApplyEdit.length > 0) editForm.applyProducts = productApplyEdit;
        if (categoryApplyEdit.length > 0) editForm.applyCategories = categoryApplyEdit;

        try {
            const res = await fetch(`/api/voucher/updateVoucher/${currentUser._id}/${editVoucherId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Update voucher failed! Try again");
                return;
            } else {
                handleShowSucccessMessage("Update voucher successfully");
                setFormEdit({});
                setProductApply([]);
                setCategoryApply([]);
                setLoadingUpdate(false);
                fetchAllVouchers();
                setEditVoucherModal(false);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingUpdate(false);
        }
    }


    // DELETE VOUCHER
    const [deleteModal, setDeleteModal] = useState(false);

    const handleDeleteVoucher = async (e) => {
        e.preventDefault();
        setLoadingDelete(true);
        try {
            const res = await fetch(`/api/voucher/deleteVoucher/${currentUser._id}/${editVoucherId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Delete voucher failed! Try again");
                return;
            } else {
                setLoadingDelete(false);
                setDeleteModal(false);
                setEditVoucherModal(false);
                setProductApply([]);
                setCategoryApply([]);
                setEditVoucherId('');
                handleShowSucccessMessage("Delete voucher successfully");
                fetchAllVouchers();
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleExportExcel = async () => {
        try {
            const res = await fetch(`/api/voucher/exportVouchers`, {
                method: "GET"
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = 'vouchers.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.log("export vouchers failed");
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className='py-[20px] px-[40px] max-md:px-[10px] max-w-full h-full overflow-x-scroll overflow-y-scroll bg-gray-100'>
            <>
                {loadingVoucher ? (
                    <Loader />
                ) : (
                    <div className='flex flex-col gap-[20px] max-w-full overflow-x-scroll'>

                        <div className='flex justify-between max-md:flex-col max-md:flex-start max-md:my-[20px]'>
                            <div className='flex gap-[20px] items-center'>
                                <MdDashboard className='text-[30px]' />
                                <h1 className='font-semibold text-[20px] max-md:text-[18px]'>Voucher Dashboard</h1>
                            </div>
                            <div className='flex gap-[20px] items-center max-md:flex-col max-md:items-start'>
                                <div onClick={() => setOpenCreateModal(true)} className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
                                    <CiCirclePlus className='text-[20px]' />
                                    <p className='text-[16px]'>Create voucher</p>
                                </div>
                                <div onClick={handleExportExcel} className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
                                    <IoIosPrint className='text-[20px]' />
                                    <p className='text-[16px]'>Print Excel</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-[10px] items-center'>
                            <FaBusinessTime className='text-[20px]' />
                            <h3 className='text-[16px] font-semibold'>Business Overview</h3>
                        </div>

                        <div className='flex max-md:flex-wrap justify-center max-md:justify-start items-center gap-[20px] py-[30px] animate__animated animate__fadeIn'>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <SiVirustotal className='text-[20px]' />
                                    <span>Total voucher: </span>
                                </div>
                                <p>{totalVoucher}</p>
                            </div>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <LiaCalendarWeekSolid className='text-[20px]' />
                                    <span>Last week voucher: </span>
                                </div>
                                <p>{lastWeekVouchers}</p>
                            </div>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <MdCalendarMonth className='text-[20px]' />
                                    <span>Last month voucher: </span>
                                </div>
                                <p>{lastMonthVouchers}</p>
                            </div>
                        </div>

                        <div className='flex gap-[10px] items-center'>
                            <MdCategory className='text-[20px]' />
                            <h3 className='text-[16px] font-semibold'>All Voucher</h3>
                        </div>

                        <div className='border mt-[20px] p-[10px] bg-white max-h-[500px] max-w-full overflow-x-scroll overflow-y-scroll '>
                            {Object.keys(allVouchers).length === 0 ? (
                                <div>Empty voucher! </div>
                            ) : (
                                <div className='flex flex-wrap gap-[20px] animate__animated animate__fadeInRight'>
                                    {allVouchers.map((voucher, index) => (
                                        <VoucherCard key={index} voucher={voucher} />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='flex gap-[10px] items-center'>
                            <CiEdit className='text-[20px]' />
                            <h3 className='text-[16px] font-semibold'>Edit Voucher</h3>
                        </div>

                        <div className='3xl:w-full w-[1300px] max-md:w-[500px]  overflow-scroll p-[20px] bg-white'>
                            {loadingVoucher ? (
                                <Loader />
                            ) : (
                                <DataTable
                                    columns={columns}
                                    data={allVouchers}
                                    pagination
                                    selectableRows
                                    highlightOnHover
                                    onRowClicked={(row) => handleRowClick(row._id)}
                                    className='animate__animated animate__fadeInUp'
                                />
                            )}
                        </div>

                    </div>

                )}
            </>
            {/* CREATE MODAL */}
            <Modal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
            >
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[1150px] h-[700px] overflow-y-scroll max-md:w-[400px] bg-white text-black  rounded-[20px] '>
                    <IoIosCloseCircleOutline onClick={() => setOpenCreateModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                    <form onSubmit={handleSubmitCreateForm} className='p-[20px]'>
                        <h3 className='py-[20px]'>Create Voucher</h3>
                        {/* code+discount */}
                        <div className='grid grid-cols-2 max-md:grid-cols-1 gap-[20px] mb-[20px]'>
                            <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col '>
                                <label className='px-[10px]'>Code</label>
                                <input required onChange={handleChangeFormCreate} type="text" id='code' placeholder='enter code' className='bg-transparent rounded-[10px] px-[10px] ' />
                            </div>
                            <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col '>
                                <label className='px-[10px]'>Discount (%) </label>
                                <input required onChange={handleChangeFormCreate} type="number" id='discount' placeholder='enter discount' className='bg-transparent rounded-[10px] px-[10px] ' />
                            </div>
                        </div>
                        {/* expiry date + usage limit */}
                        <div className='grid grid-cols-2 max-md:grid-cols-1 gap-[20px] mb-[20px]'>
                            <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col '>
                                <label className='px-[10px]'>Expiry Date </label>
                                <input required onChange={handleChangeFormCreate} type="date" id='expiryDate' placeholder='enter discount' className='bg-transparent rounded-[10px] px-[10px] ' />
                            </div>
                            <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col '>
                                <label className='px-[10px]'>Usage limit</label>
                                <input required onChange={handleChangeFormCreate} type="number" id='usageLimit' placeholder='enter code' className='bg-transparent rounded-[10px] px-[10px] ' />
                            </div>
                        </div>
                        {/* products + categories */}
                        <div className='grid grid-cols-2 max-md:grid-cols-1 gap-[20px] mb-[20px] '>

                            <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col max-h-[300px] overflow-y-scroll  '>
                                <div className='flex justify-between'>
                                    <label className='px-[10px]'>Products applicable</label>
                                    <p onClick={() => setProductModal(true)} className='text-black cursor-pointer hover:text-blue-500'>(all products)</p>
                                </div>
                                <div className='flex justify-between'>
                                    <input value={productApplyInput} onChange={handleInputCreateProduct} type="text" id='applyProducts' placeholder='enter product' className='bg-transparent rounded-[10px] px-[10px] w-[400px] max-md:w-[300px] ' />
                                    <div onClick={handleAddCreateProduct} className='cursor-pointer'>Add</div>
                                </div>

                                {/* Nested Modal Product */}
                                <Modal
                                    open={productModal}
                                    onClose={() => setProductModal(false)}
                                    className="z-40"
                                >
                                    <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[1000px] max-md:w-[300px] h-[500px] overflow-y-scroll bg-white text-black rounded-[20px]'>
                                        <IoIosCloseCircleOutline onClick={() => setProductModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                                        <div className='p-[20px]'>
                                            <h3>Select Products</h3>
                                            {loadingProduct ? (
                                                <Loader />
                                            ) : (
                                                <div>
                                                    {allProducts.map((product, index) => (
                                                        <div onClick={() => selectProduct(product._id)} className='border rounded-[10px] p-[10px] my-[10px] border-black cursor-pointer grid grid-cols-2 max-md:grid-cols-1 max-md:text-[12px]' key={index}>
                                                            <div className='flex gap-[20px] '>
                                                                <p>ID: </p>
                                                                <p>{product._id}</p>
                                                            </div>
                                                            <div className='flex gap-[8px] '>
                                                                <p> Name: </p>
                                                                <p>{product.name}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Modal>

                                <div className='flex flex-wrap gap-[10px] my-[20px] '>
                                    {productApply?.map((item, index) => (
                                        <div key={index} className='relative p-[10px] rounded-[5px] w-[300px] bg-blue-400'>
                                            {item}
                                            <BiTrash onClick={() => handleRemoveCreateProduct(index)} className='absolute top-[5px] right-[5px] hover:text-white cursor-pointer' />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col max-h-[300px] overflow-y-scroll  '>
                                <div className='flex justify-between'>
                                    <label className='px-[10px]'>Categories applicable</label>
                                    <p onClick={() => setCategoryModal(true)} className='text-black cursor-pointer hover:text-blue-500'>(all categories)</p>
                                </div>
                                <div className='flex justify-between'>
                                    <input value={categoryApplyInput} onChange={handleInputCreateCategory} type="text" id='applyProducts' placeholder='enter category' className='bg-transparent rounded-[10px] px-[10px] w-[400px] max-md:w-[300px] ' />
                                    <div onClick={handleAddCreateCategory}>Add</div>
                                </div>

                                {/* Nested Modal Category */}
                                <Modal
                                    open={categoryModal}
                                    onClose={() => setCategoryModal(false)}
                                    className="z-40"
                                >
                                    <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[1000px] max-md:w-[300px] h-[500px] overflow-y-scroll bg-white text-black rounded-[20px]'>
                                        <IoIosCloseCircleOutline onClick={() => setCategoryModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                                        <div className='p-[20px]'>
                                            <h3>Select Categories</h3>
                                            {loadingCategory ? (
                                                <Loader />
                                            ) : (
                                                <div>
                                                    {allCategories.map((category, index) => (
                                                        <div onClick={() => selectCategory(category._id)} className='border rounded-[10px] p-[10px] my-[10px] border-black cursor-pointer grid grid-cols-2 max-md:grid-cols-1 max-md:text-[12px]' key={index}>
                                                            <div className='flex gap-[20px] '>
                                                                <p>ID: </p>
                                                                <p>{category._id}</p>
                                                            </div>
                                                            <div className='flex gap-[8px] '>
                                                                <p> Name: </p>
                                                                <p>{category.name}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Modal>

                                <div className='flex flex-wrap gap-[10px] my-[20px]'>
                                    {categoryApply?.map((item, index) => (
                                        <div key={index} className='relative p-[10px] rounded-[5px] w-[300px] bg-green-400'>
                                            {item}
                                            <BiTrash onClick={() => handleRemoveCreateCategory(index)} className='absolute top-[5px] right-[5px] hover:text-white cursor-pointer' />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <button type='submit' className='bg-red-400 rounded-[30px] py-[10px] text-center w-[100px] cursor-pointer hover:opacity-70 hover:text-white'>
                            Create
                        </button>
                    </form>
                </div>

            </Modal>

            {/* EDIT + DELETE MODAL */}
            <Modal
                open={editVoucherModal}
                onClose={() => setEditVoucherModal(false)}
            >
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[1150px] h-[700px] overflow-y-scroll max-md:w-[400px] bg-white text-black  rounded-[20px] '>
                    <IoIosCloseCircleOutline onClick={() => setEditVoucherModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                    <form onSubmit={handleSubmitEditForm} className='p-[20px]'>
                        <h3 className='py-[20px]'>Edit Voucher</h3>
                        {loadingEditVoucher ? (
                            <Loader />
                        ) : (
                            <>
                                {/* code+discount */}
                                <div className='grid grid-cols-2 max-md:grid-cols-1 gap-[20px] mb-[20px]'>
                                    <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col '>
                                        <label className='px-[10px]'>Code</label>
                                        <input onChange={handleEditFormChange} defaultValue={prevVoucher.code} required type="text" id='code' placeholder='enter code' className='bg-transparent rounded-[10px] px-[10px] ' />
                                    </div>
                                    <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col '>
                                        <label className='px-[10px]'>Discount (%) </label>
                                        <input onChange={handleEditFormChange} defaultValue={prevVoucher.discount} required type="number" id='discount' placeholder='enter discount' className='bg-transparent rounded-[10px] px-[10px] ' />
                                    </div>
                                </div>
                                {/* expiry date + usage limit */}
                                <div className='grid grid-cols-2 max-md:grid-cols-1 gap-[20px] mb-[20px]'>
                                    <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col '>
                                        <label className='px-[10px]'>Expiry Date </label>
                                        <input onChange={handleEditFormChange} defaultValue={prevVoucher.expiryDate} required type="date" id='expiryDate' placeholder='enter discount' className='bg-transparent rounded-[10px] px-[10px] ' />
                                    </div>
                                    <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col '>
                                        <label className='px-[10px]'>Usage limit</label>
                                        <input onChange={handleEditFormChange} defaultValue={prevVoucher.usageLimit} required type="number" id='usageLimit' placeholder='enter code' className='bg-transparent rounded-[10px] px-[10px] ' />
                                    </div>
                                </div>
                                {/* products + categories */}
                                <div className='grid grid-cols-2 max-md:grid-cols-1 gap-[20px] mb-[20px] '>

                                    {/* PRODUCT */}
                                    <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col max-h-[300px] overflow-y-scroll  '>
                                        <div className='flex justify-between'>
                                            <label className='px-[10px]'>Products applicable</label>
                                            <p onClick={() => setProductModal(true)} className='text-black cursor-pointer hover:text-blue-500'>(all products)</p>
                                        </div>
                                        <div className='flex justify-between'>
                                            <input value={productEditInput} onChange={handleInputEditProduct} type="text" id='applyProducts' placeholder='enter product' className='bg-transparent rounded-[10px] px-[10px] w-[400px] max-md:w-[300px] ' />
                                            <div onClick={handleAddEditProduct} className='cursor-pointer'>Add</div>
                                        </div>

                                        {/* Nested Modal Product */}
                                        <Modal
                                            open={productModal}
                                            onClose={() => setProductModal(false)}
                                            className="z-40"
                                        >
                                            <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[1000px] max-md:w-[300px] h-[500px] overflow-y-scroll bg-white text-black rounded-[20px]'>
                                                <IoIosCloseCircleOutline onClick={() => setProductModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                                                <div className='p-[20px]'>
                                                    <h3>Select Products</h3>
                                                    {loadingProduct ? (
                                                        <Loader />
                                                    ) : (
                                                        <div>
                                                            {allProducts.map((product, index) => (
                                                                <div onClick={() => selectProductEdit(product._id)} className='border rounded-[10px] p-[10px] my-[10px] border-black cursor-pointer grid grid-cols-2 max-md:grid-cols-1 max-md:text-[12px]' key={index}>
                                                                    <div className='flex gap-[20px] '>
                                                                        <p>ID: </p>
                                                                        <p>{product._id}</p>
                                                                    </div>
                                                                    <div className='flex gap-[8px] '>
                                                                        <p> Name: </p>
                                                                        <p>{product.name}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Modal>

                                        <div className='flex flex-wrap gap-[10px] my-[20px] '>
                                            {productApplyEdit?.map((item, index) => (
                                                <div key={index} className='relative p-[10px] rounded-[5px] w-[300px] bg-blue-400'>
                                                    {item}
                                                    <BiTrash onClick={() => handleRemoveEditProduct(index)} className='absolute top-[5px] right-[5px] hover:text-white cursor-pointer' />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CATEGORIES */}
                                    <div className='rounded-[10px] bg-gray-100 py-[20px] px-[10px] flex flex-col max-h-[300px] overflow-y-scroll  '>
                                        <div className='flex justify-between'>
                                            <label className='px-[10px]'>Categories applicable</label>
                                            <p onClick={() => setCategoryModal(true)} className='text-black cursor-pointer hover:text-blue-500'>(all categories)</p>
                                        </div>
                                        <div className='flex justify-between'>
                                            <input value={categoryEditInput} onChange={handleInputEditCategory} type="text" id='applyProducts' placeholder='enter category' className='bg-transparent rounded-[10px] px-[10px] w-[400px] max-md:w-[300px] ' />
                                            <div onClick={handleAddEditCategory}>Add</div>
                                        </div>

                                        {/* Nested Modal Category */}
                                        <Modal
                                            open={categoryModal}
                                            onClose={() => setCategoryModal(false)}
                                            className="z-40"
                                        >
                                            <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[1000px] max-md:w-[300px] h-[500px] overflow-y-scroll bg-white text-black rounded-[20px]'>
                                                <IoIosCloseCircleOutline onClick={() => setCategoryModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                                                <div className='p-[20px]'>
                                                    <h3>Select Categories</h3>
                                                    {loadingCategory ? (
                                                        <Loader />
                                                    ) : (
                                                        <div>
                                                            {allCategories.map((category, index) => (
                                                                <div onClick={() => selectCategoryEdit(category._id)} className='border rounded-[10px] p-[10px] my-[10px] border-black cursor-pointer grid grid-cols-2 max-md:grid-cols-1 max-md:text-[12px]' key={index}>
                                                                    <div className='flex gap-[20px] '>
                                                                        <p>ID: </p>
                                                                        <p>{category._id}</p>
                                                                    </div>
                                                                    <div className='flex gap-[8px] '>
                                                                        <p> Name: </p>
                                                                        <p>{category.name}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Modal>

                                        <div className='flex flex-wrap gap-[10px] my-[20px]'>
                                            {categoryApplyEdit?.map((item, index) => (
                                                <div key={index} className='relative p-[10px] rounded-[5px] w-[300px] bg-green-400'>
                                                    {item}
                                                    <BiTrash onClick={() => handleRemoveEditCategory(index)} className='absolute top-[5px] right-[5px] hover:text-white cursor-pointer' />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                                {/* button */}
                                <div className='flex gap-[20px]'>
                                    <button type='submit' className='bg-blue-400 rounded-[30px] py-[10px] text-center w-[100px] cursor-pointer hover:opacity-70 hover:text-white'>
                                        Save
                                    </button>
                                    <div onClick={() => setDeleteModal(true)} className='bg-red-400 rounded-[30px] py-[10px] text-center w-[100px] cursor-pointer hover:opacity-70 hover:text-white'>
                                        Delete
                                    </div>

                                    {/* Nested Modal Category */}
                                    <Modal
                                        open={deleteModal}
                                        onClose={() => setDeleteModal(false)}
                                        className="z-40"
                                    >
                                        <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[400px] max-md:w-[300px]  h-[200px] overflow-y-scroll bg-white text-black rounded-[20px]'>
                                            <IoIosCloseCircleOutline onClick={() => setDeleteModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                                            {loadingDelete ? (
                                                <Loader />
                                            ) : (
                                                <div className='flex flex-col gap-[30px] justify-center items-center mt-[50px] p-[10px]'>
                                                    <h3 className='text-center'>Are you sure to delete this voucher ?</h3>
                                                    <div className='flex justify-center gap-[50px]'>
                                                        <div onClick={handleDeleteVoucher} className='rounded-[20px] px-[10px] py-[5px] bg-red-400 w-[100px] text-center cursor-pointer hover:opacity-70 hover:text-white'>Yes</div>
                                                        <div onClick={() => setDeleteModal(false)} className='rounded-[20px] px-[10px] py-[5px] bg-blue-400 w-[100px] text-center cursor-pointer hover:opacity-70 hover:text-white'>Cancel</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Modal>
                                </div>
                            </>
                        )}
                    </form>
                </div>

            </Modal >


        </div >
    )
}

export default Voucher