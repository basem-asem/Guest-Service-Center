import { Grid, InputAdornment, TextField, Typography, Button } from "@mui/material";
import { AccountSearch } from "mdi-material-ui";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import UserTable from "src/views/tables/RequestTable";
import { Plus } from "mdi-material-ui";
import RequestForm from "src/views/forms/RequestForm";
import {
  collection,
  onSnapshot,
  getDoc,doc 
} from "firebase/firestore";
import { db} from "src/configs/firebaseConfig";

const Request = () => {
  // ** State
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
const [filterData, setFilterData] = useState("")
  const handleClickOpen = (_, ) => {
    setOpen(true);
  };
   // Function for close popup
   const handleClose = () => {
    setOpen(false);
  };
 
  useEffect(() => {
    const Query = collection(db, "requests");
    onSnapshot(Query, async (snapshot) => {
      const allRequests = [];
      snapshot.forEach((doc) => {
        allRequests.push({ docid: doc.id, ...doc.data() });
      });
  
      const updatedRequests = await Promise.all(allRequests.map(async (request) => {
        if (request.orderRes) {
          const userDoc = await getDoc(doc(db, "users", request.orderRes));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log(userData.display_name);
            request.orderRes = userData.display_name; // Assuming the user object has a "displayName" property
          }
        }
        console.log(request)
        return request;
      }));
  
      const filteredArray = updatedRequests.filter(
        (obj) => obj.guestName?.toLowerCase().match(filterData.toLowerCase())
      );
  
      setUsers(filteredArray);
      setLoading(false);
    });
  
  }, [loading]);
   // Update dependency array to include 'string' instead of 'loading'
  
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
            {t("request.page.form.add.request")}
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
      <RequestForm
        open={open}
        handleClose={handleClose}
      />
      <UserTable children={users} loading={loading} setLoading={setLoading} />
    </>
  );
};

export default Request;
