import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import AppUrl from "../../RestAPI/AppUrl";

export default function SearchRoom(props) {
    const [roomsList, setRoomsList] = useState([]);

    useEffect(() => {
        axios.get(AppUrl.ShowRooms).then((response) => {
          if (response.data.status === 200) {
            setRoomsList(response.data.allRooms);
          }
        });
      }, []);

      const handleChange = (event, room) => {
        props.getSelectedRoom(room);
      };

  return (
    <Fragment>
      <Autocomplete
        id="inputRenterId"
        sx={{ width: 300 }}
        options={roomsList}
        autoHighlight
        getOptionLabel={(option) => option.number}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            {option.number}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Choose a room" />}
        onChange={handleChange}
      />
    </Fragment>
  )
}
