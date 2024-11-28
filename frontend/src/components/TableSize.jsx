import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// ANIMATE
import 'animate.css';

import Slider from '@mui/material/Slider';

const TableSize = () => {

    const [selectTableSize, setSelectTableSize] = useState(false);

    const sizeData = [
        { label: "Chiều cao", M: "1m55 - 1m62", L: "1m63 - 1m69", XL: "1m70 - 1m76", "2XL": "1m77 - 1m83", "3XL": "1m84 - 1m92" },
        { label: "Cân nặng", M: "51kg - 59kg", L: "60kg - 68kg", XL: "69kg - 77kg", "2XL": "78kg - 84kg", "3XL": "85kg - 90kg" },
        { label: "Dài quần", M: 94, L: 96, XL: 98, "2XL": 100, "3XL": 102 },
        { label: "1/2 Vòng mông", M: 51, L: 53, XL: 55, "2XL": 57, "3XL": 59 },
        { label: "1/2 Vòng đùi", M: 34, L: 34.5, XL: 35, "2XL": 35.5, "3XL": 36 },
        { label: "1/2 Vòng eo", M: 33, L: 35, XL: 37, "2XL": 39, "3XL": 41 },
    ];

    const [height, setHeight] = useState(155);
    const [weight, setWeight] = useState(51);

    const [calculateDone, setCalculateDone] = useState(false);
    const [shirtSize, setShirtSize] = useState("");
    const [pantsSize, setPantsSize] = useState("");

    const calculateSize = () => {
        let shirtSize = "";
        let pantSize = "";

        if (height >= 155 && height <= 162) shirtSize = "M";
        else if (height >= 163 && height <= 169) shirtSize = "L";
        else if (height >= 170 && height <= 176) shirtSize = "XL";
        else if (height >= 177 && height <= 183) shirtSize = "2XL";
        else if (height >= 184 && height <= 192) shirtSize = "3XL";
        else shirtSize = "Unknown";

        if (weight >= 51 && weight <= 59) pantSize = "M";
        else if (weight >= 60 && weight <= 68) pantSize = "L";
        else if (weight >= 69 && weight <= 77) pantSize = "XL";
        else if (weight >= 78 && weight <= 84) pantSize = "2XL";
        else if (weight >= 85 && weight <= 90) pantSize = "3XL";
        else pantSize = "Unknown";

        setShirtSize(shirtSize);
        setPantsSize(pantSize);
        setCalculateDone(true);
    };


    return (
        <div className='flex flex-col gap-[20px]'>
            <div className='border border-gray-300 rounded-[20px] flex items-center w-[300px] h-[40px] '>
                <div onClick={() => setSelectTableSize(false)} className={`${selectTableSize === false ? 'bg-gray-200' : ''} h-[40px] rounded-[20px] w-[200px] flex justify-center items-center cursor-pointer`}>
                    <p>Hướng dẫn chọn size</p>
                </div>
                <div onClick={() => setSelectTableSize(true)} className={`${selectTableSize === true ? 'bg-gray-200' : ''} h-[40px] rounded-[20px] w-[100px] flex justify-center items-center cursor-pointer`}>
                    <p>Bảng size</p>
                </div>
            </div>

            <div>
                {
                    selectTableSize ? (
                        <div className='flex flex-col gap-[20px] animate__animated animate__fadeInLeft'>
                            <table className='w-full border-collapse'>
                                <thead>
                                    <tr className="border border-gray-400">
                                        <th className="p-[10px] border border-gray-400 text-left">Size</th>
                                        <th className="p-[10px] border border-gray-400 text-left">M</th>
                                        <th className="p-[10px] border border-gray-400 text-left">L</th>
                                        <th className="p-[10px] border border-gray-400 text-left">XL</th>
                                        <th className="p-[10px] border border-gray-400 text-left">2XL</th>
                                        <th className="p-[10px] border border-gray-400 text-left">3XL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sizeData.map((row, index) => (
                                        <tr key={index}>
                                            <td className="p-[10px] border border-gray-400">{row.label}</td>
                                            <td className="p-[10px] border border-gray-400">{row.M}</td>
                                            <td className="p-[10px] border border-gray-400">{row.L}</td>
                                            <td className="p-[10px] border border-gray-400">{row.XL}</td>
                                            <td className="p-[10px] border border-gray-400">{row["2XL"]}</td>
                                            <td className="p-[10px] border border-gray-400">{row["3XL"]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <img src="/public/size.jpg" alt="" className='w-[300px] h-[300px]' />
                        </div>
                    ) : (
                        <div className='flex flex-col gap-[20px] animate__animated animate__fadeInRight'>
                            <div className='flex items-center gap-[20px] w-full'>
                                <label className='w-[100px]'>Chiều cao</label>
                                <Slider
                                    size="medium"
                                    value={height}
                                    onChange={(e, newValue) => setHeight(newValue)}
                                    min={155}
                                    max={192}
                                    valueLabelDisplay="auto"
                                />
                                <p className='w-[100px]'>{height} cm</p>
                            </div>
                            <div className='flex items-center gap-[20px] w-full'>
                                <label className='w-[100px]'>Cân nặng</label>
                                <Slider
                                    size="medium"
                                    value={weight}
                                    onChange={(e, newValue) => setWeight(newValue)}
                                    min={51}
                                    max={90}
                                    valueLabelDisplay="auto"
                                />
                                <p className='w-[100px]'>{weight} kg</p>
                            </div>
                            <div onClick={calculateSize} className='bg-blue-400 rounded-[20px] w-[160px] h-[40px] flex justify-center items-center cursor-pointer hover:bg-blue-300'>Xác nhận</div>

                            {
                                calculateDone && (
                                    <>
                                        <div className='border rounded-[20px] w-[400px] h-[50px] py-[5px] px-[10px] flex items-center gap-[30px]'>
                                            <p>Size áo phù hợp với bạn là: </p>
                                            <p className='text-red-300'>{shirtSize}</p>
                                        </div>
                                        <div className='border rounded-[20px] w-[400px] h-[50px] py-[5px] px-[10px] flex items-center gap-[30px]'>
                                            <p>Size quần phù hợp với bạn là: </p>
                                            <p className='text-red-300'>{pantsSize}</p>
                                        </div>
                                    </>
                                )
                            }


                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default TableSize