import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import AppUrl from "../../RestAPI/AppUrl";

export default function SearchService(props) {
    const [servicesList, setServicesList] = useState([]);

    useEffect(() => {
      axios.get(AppUrl.GetOptionalServices).then((response) => {
        if (response.data.status === 200) {
            setServicesList(response.data.allOptionalServices);
        }
      });
    }, []);
  
    const handleChange = (event, service) => {
      props.getSelectedService(service);
    };
  
    return (
      <Fragment>
        <Autocomplete
          id="inputRenterId"
          fullWidth
          options={servicesList}
          autoHighlight
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              {option.name}
            </Box>
          )}
          renderInput={(params) => <TextField required {...params} h label="Choose an optional service" />}
          onChange={handleChange}
        />
      </Fragment>
    );
}
