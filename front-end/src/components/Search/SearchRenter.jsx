import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import AppUrl from "../../RestAPI/AppUrl";

export default function SearchRenter(props) {
  const [rentersList, setRentersList] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowRenters).then((response) => {
      if (response.data.status === 200) {
        setRentersList(response.data.allRenters);
      }
    });
  }, []);

  const handleChange = (event, renter) => {
    props.getSelectedRenter(renter);
  };

  return (
    <Fragment>
      <Autocomplete
        id="inputRenterId"
        fullWidth
        options={rentersList}
        autoHighlight
        getOptionLabel={(option) => option.name ? option.name : ""}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            {option.name} ({option.phone_number}) {option.email}
          </Box>
        )}
        renderInput={(params) => <TextField required {...params} label="Choose a renter" />}
        onChange={handleChange}
      />
    </Fragment>
  );
}
