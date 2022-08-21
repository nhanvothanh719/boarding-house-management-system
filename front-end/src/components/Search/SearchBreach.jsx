import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import AppUrl from "../../RestAPI/AppUrl";

export default function SearchBreach(props) {
    const [breachesList, setBreachesList] = useState([]);

    useEffect(() => {
      axios.get(AppUrl.ShowBreaches).then((response) => {
        if (response.data.status === 200) {
          setBreachesList(response.data.allBreaches);
        }
      });
    }, []);
  
    const handleChange = (event, breach) => {
      props.getSelectedBreach(breach);
    };
  
    return (
      <Fragment>
        <Autocomplete
          id="inputRenterId"
          sx={{ width: 300 }}
          options={breachesList}
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
          renderInput={(params) => <TextField {...params} label="Choose a breach" />}
          onChange={handleChange}
        />
      </Fragment>
    );
}
