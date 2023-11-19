import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CDBInput, CDBCard, CDBCardBody, CDBIcon, CDBBtn, CDBLink, CDBContainer } from 'cdbreact';


import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "tw-elements-react/dist/css/tw-elements-react.min.css";



import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { TEInput, TERipple } from "tw-elements-react";


function Course({ index, handleFormChange }) {
  const [course, setCourse] = useState("");


  return (
    <>
      <div className="class-form" key={index}>
        <div>
          <input type="text" className="form-control" onChange={event => handleFormChange(index, event)}
          />
        </div>
      </div>
    </>
  );
}

//Helpful: https://www.freecodecamp.org/news/build-dynamic-forms-in-react/

function App() {
  const [inputFields, setInputFields] = useState([
    { course: '' }
  ]);

  const addFields = () => {
    let newfield = { course: '' }

    setInputFields([...inputFields, newfield])
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(inputFields)
  };

  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  };


  return (
    <>
      <div class="p-5 bg-light">
        <h1 class="mb-3">Heading</h1>
      </div>




      <form onSubmit={submit}>
        {inputFields.map((input, index) => {
          return (
            <div key={index}>
              <Course index={index} handleFormChange={handleFormChange}></Course>
            </div>
          )
        })}
      </form>

      <Button onClick={addFields} className="rounded-circle">+</Button>{' '}
      <Button onClick={submit} type="submit" variant="primary">Submit</Button>{' '}

      <section className="h-screen">
        <div className="h-full">
          {/* <!-- Left column container with background--> */}
          <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
            <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
              <img
                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="w-full"
                alt="Sample image"
              />
            </div>

            {/* <!-- Right column container --> */}
            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
              <form>

                {/* <!-- Separator between social media sign in and email/password sign in --> */}
                <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                  <p className="mx-4 mb-0 text-center font-semibold dark:text-white">
                    Courses
                  </p>
                </div>

                {/* <!-- Email input --> */}
                <TEInput
                  type="email"
                  label="Class 1"
                  size="lg"
                  className="mb-6"
                ></TEInput>

                {/* <!--Password input--> */}
                <TEInput
                  type="password"
                  label="Class 2"
                  className="mb-6"
                  size="lg"
                ></TEInput>


                {/* <!-- Login button --> */}
                <div className="text-center lg:text-left">
                  <TERipple rippleColor="light">
                    <button
                      type="button"
                      className="inline-block rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    >
                      Submit
                    </button>
                  </TERipple>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export default App;
