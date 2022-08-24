import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import AppUrl from "../../RestAPI/AppUrl";

export default function SearchCategoryEdit(props) {
    const [categoriesList, setCategoriesList] = useState([]);

    useEffect(() => {
      axios.get(AppUrl.ShowCategories).then((response) => {
        if (response.data.status === 200) {
          setCategoriesList(response.data.allCategories);
          props.getSelectedCategory(props.currentCategory);
        }
      });
    }, [props]);
  
    const handleChange = (event, category) => {
      props.getSelectedCategory(category);
    };
  
    return (
      <Fragment>
        <Autocomplete
          id="inputRenterId"
          fullWidth
          options={categoriesList}
          value={props.currentCategory}
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
          renderInput={(params) => <TextField required {...params} h label="Choose a category" />}
          onChange={handleChange}
        />
      </Fragment>
    );
}
