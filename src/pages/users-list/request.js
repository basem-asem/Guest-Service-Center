import { Grid, InputAdornment, TextField, Typography, Button } from "@mui/material";
import { AccountSearch } from "mdi-material-ui";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { getUsersByType } from "src/@core/utils/firebaseutils";
import UserTable from "src/views/tables/UserTable";
import { Plus } from "mdi-material-ui";
import UserForm from "src/views/forms/UserForm";

const Request = () => {
  // ** State
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleClickOpen = (_, ) => {
    setOpen(true);
  };
   // Function for close popup
   const handleClose = () => {
    setOpen(false);
  };
  // const filterData = (string = "") => {
  //   getUsersByType("users", "User").then((allusers) => {
  //     const filteredArray = allusers.filter((obj) =>
  //       obj.display_name?.toLowerCase().match(string.toLowerCase())
  //     );
  //     setUsers(filteredArray);
  //     setLoading(false);
  //   });
  // };

  // useEffect(() => {
  //   filterData();
  // }, [loading]);

  return (
    <>
      <Grid container spacing={6} justifyContent="space-between">
        <Grid item>
          <Typography variant="h5" sx={{ marginBottom: 6 }}>
            {t("navbar.Users")}
          </Typography>
        </Grid>
        <Grid
          item
          textAlign="right"
          sx={{
            display: "flex",
            gap: "1rem",
            marginBottom: 4,
          }}
        >
          <Button variant="contained" onClick={handleClickOpen}>
            <Plus sx={{ marginRight: 1.5 }} />
            {t("subscription.page.btn.newsubscription")}
          </Button>
          
        </Grid>
        {/* <Grid item>
          <TextField
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
            placeholder={t("form.search.name")}
            autoFocus={true}
            focused={true}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountSearch fontSize="small" />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              filterData(e.target.value.trim());
            }}
          />
        </Grid> */}
      </Grid>
      <UserForm
        open={open}
        handleClose={handleClose}
        // articleId={articleId}
      />
      <UserTable children={users} loading={loading} setLoading={setLoading} />
    </>
  );
};

export default Request;
