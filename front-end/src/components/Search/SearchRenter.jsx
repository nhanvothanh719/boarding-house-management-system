import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import AppUrl from "../../RestAPI/AppUrl";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function SearchRenter(props) {
  const [rentersList, setRentersList] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowRenters).then((response) => {
      if (response.data.status === 200) {
        setRentersList(response.data.allRenters);
      }
    });
  }, []);

  const handleChange = (event, value) => {
    props.getSelectedRenter(value);
  };

  return (
    <Fragment>
      <Autocomplete
        id="inputRenterId"
        sx={{ width: 300 }}
        options={rentersList}
        autoHighlight
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            {/* <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          /> */}
            {option.name} ({option.phone_number}) {option.email}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Choose a renter" />}
        onChange={handleChange}
      />
    </Fragment>
  );
}
