import React, { Fragment, useEffect, useState } from "react";
 import AppUrl from "../../../RestAPI/AppUrl";
 import { useHistory } from "react-router-dom";
 import swal from "sweetalert";
 import axios from "axios";
 import Loading from "../../../components/Loading";

 export default function EditService({ match }) {
   const history = useHistory();
   const serviceId = match.params.serviceID;
   const [errors, setErrors] = useState([]);
   const [loading, setLoading] = useState(true);
   const [checkbox, setCheckbox] = useState([]);

   const [input, setInput] = useState({
     name: "",
     description: "",
     unit: "",
     unit_price: "",
     //is_compulsory: "",
   });

   const handleInput = (e) => {
     e.persist();
     setInput({ ...input, [e.target.name]: e.target.value });
   };

   const handleCheckbox = (e) => {
     e.persist();
     setCheckbox({ ...checkbox, [e.target.name]: e.target.checked });
   };


   useEffect(() => {
     axios.get(AppUrl.EditService + serviceId).then((response) => {
       if (response.data.status === 200) {
         setInput(response.data.service);
         setCheckbox(response.data.service);
       }  else if (response.data.status === 404) {
         swal("Error", response.data.message, "error");
         history.push("/admin/view-all-services");
       }
       setLoading(false);
     });
   }, [serviceId, history]);

   const updateService = (e) => {
     e.preventDefault();
     const service = {
       name: input.name,
       description: input.description,
       unit: input.unit,
       unit_price: input.unit_price,
       is_compulsory: checkbox.is_compulsory,
     };
     axios
       .put(AppUrl.UpdateService + serviceId, service)
       .then((response) => {
         if (response.data.status === 200) {
           swal("Success", response.data.message, "success");
           setErrors([]);
           history.push("/admin/view-all-services");
         } else if (response.data.status === 422) {
           swal("All fields are mandatory", "", "error");
           setErrors(response.data.errors);
         } else if (response.data.status === 404) {
           swal("Error", response.data.message, "error");
         }
       })
       .catch((error) => {
         console.log(error);
       });
   };

   return (
     <Fragment>
       <div className="topContainer">
         <h1>Add new service</h1>
       </div>
       <div className="bottomContainer">
         <div className="bottomRightContainer">
           <form
             className="flexForm"
             onSubmit={updateService}
           >
             <div className="formInput">
               <label className="inputItemLabel">Service name:</label>
               <input
                 type="text"
                 className="inputItem"
                 name="name"
                 onChange={handleInput}
                 value={input.name}
               />
             </div>
             <span>{errors.name}</span>
             <div className="formInput">
               <label className="inputItemLabel">Description:</label>
               <textarea
                 type="text"
                 className="inputItem"
                 name="description"
                 onChange={handleInput}
                 value={input.description}
               />
             </div>
             <div className="formInput">
               <label className="inputItemLabel">Unit:</label>
               <input
                 type="text"
                 className="inputItem"
                 name="unit"
                 onChange={handleInput}
                 value={input.unit}
               />
             </div>
             <span>{errors.unit}</span>
             <div className="formInput">
               <label className="inputItemLabel">Cost per unit:</label>
               <input
                 type="text"
                 className="inputItem"
                 name="unit_price"
                 onChange={handleInput}
                 value={input.unit_price}
               />
             </div>
             <span>{errors.unit_price}</span>
             <div className="formInput">
               <label>Compulsory:</label>
               <input
                 type="checkbox"
                 className="inputItem"
                 name="is_compulsory"
                 onChange={handleCheckbox}
                 defaultChecked={checkbox.is_compulsory === 1 ? true : false}
               />
             </div>
             <span>{errors.is_compulsory}</span>
             <button type="submit" className="formButton">
               Create
             </button>
           </form>
         </div>
       </div>
     </Fragment>
   );
 }