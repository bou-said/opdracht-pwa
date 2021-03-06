import React, {useEffect, useState} from 'react';
import {NotificationsOnline} from "../utilities/notificationsOnline";



export function SearchWeather() {

    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");
    //temp
    const tempInCelsius = (data?.main) && (data.main.temp - 272.15).toFixed(1);
    const tempInCelsiusMin = (data?.main) && (data.main.temp_min - 272.15).toFixed(1);
    const tempInCelsiusMax = (data?.main) && (data.main.temp_max - 272.15).toFixed(1);

    //date
    const d = new Date();
    const date = d.getDate();
    const year = d.getFullYear();
    const month = d.toLocaleString("default", {month: 'long'})
    const day = d.toLocaleString("default", {weekday: 'long'})

    console.log({data, input});

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=e03a93b2e9494533123356c466c48f82`);
                setData(await response.json())

            } catch (err) {
                console.log(err.message);
            }
        }
        fetchWeather()
    }, [search])



    const saveLocalItems = () => {
        localStorage.setItem("search", JSON.stringify(search));
    };

    const getLocalItems = () => {
        const searchLocal = JSON.parse(localStorage.getItem("search"))
        setSearch(searchLocal);
    }

    useEffect(() => {
        getLocalItems()
    }, []);

    useEffect(() => {
        saveLocalItems()
    }, [search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearch(input);
    };


    return (
        <div>
            <div className="container mt-5 ">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="card bg-dark text-white border-0">
                            <img src="background-image.png"
                                 className="card-img"
                                 alt="..."/>
                            <div className="card-img-overlay">
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group mb-4 w-75 mx-auto">
                                        <input type="search"
                                               className="form-control"
                                               placeholder="Search City"
                                               aria-label="Search City"
                                               aria-describedby="basic-addon2"
                                               name="search"
                                               value={input}
                                               onChange={(e) => setInput(e.target.value)}
                                               required/>
                                        <button type="submit" className="input-group-text" id="basic-addon2">
                                            Search
                                        </button>
                                    </div>
                                </form>
                                <div className="bg-dark bg-opacity-50 py-3 justify-content-center">
                                    <h5 className="card-title">{data?.name && data.name} - {data?.sys && data.sys.country}</h5>
                                    <p className="card-text lead">{day}, {month} {date}, {year}</p>
                                    <hr/>
                                    <h1 className="fw-bolder mb-5">{tempInCelsius} &deg;C</h1>
                                    <p className="lead fw-bolder mb-0">{data?.main && data.weather[0].main} - {data?.main && data.weather[0].description}</p>
                                    <p className="lead">{tempInCelsiusMin} &deg;C | {tempInCelsiusMax} &deg;C</p>
                                </div>
                                <NotificationsOnline data={data} />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};
