import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "src/configs/firebaseConfig";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { IconButton, Typography } from "@mui/material";

import Link from "next/link";
import { AccountLock, Eye, Pencil, Delete, Plus} from "mdi-material-ui";
import AlertMessage from "../../views/Alert/AlertMessage";
import { CircularProgress, TablePagination } from "@mui/material";
import TextField from "@mui/material/TextField";
import userProfile from "public/images/logos/userProfile.png";
import BlockDialog from "../../views/dailogs/Dialogbox";
import InputAdornment from "@mui/material/InputAdornment";
import Magnify from "mdi-material-ui/Magnify";
import Grid from '@mui/material/Grid';
import { useRouter } from "next/router";
import { auto } from "@popperjs/core";
import useTranslation from "src/@core/hooks/useTranslation";
import UserForm from "../../views/forms/UserForm";
import DeleteDailog from "./DeleteDailog";

function user() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [inputSearch, setInputSearch] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [showPop, setShowPop] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');

  const { t } = useTranslation(router?.locale);
  
  // function for delete Service details
  const handleDelete = async () => {
    // delete user
    const deleteUser = doc(db, "users", userId);
    await deleteDoc(deleteUser).then( () => {
      console.log(userId);
      setShowPop(false);
      setUserId("");
      // Delete Alert
      setAlertpop({
        open: true,
        message: t("data.delete"),
      });
    });
  };
  
  const handlePopopen = (serviceid, id) => {
    setUserId(serviceid);
    setShowPop(true);
  };
  const handleClickOpen = (_, id) => {
    setUserId(id);
    setOpen(true);
  };
  const handleClickOpens = (_,) => {
    setOpen(true);
  };
  const handleClose = () => {
    setUserId("");
    setOpen(false);
  };

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const [Blockpop, setBlockpop] = useState({
    open: false,
    blockid: "",
    isblock: "",
  });

 const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
    
    
    // function for close popup
    const handlePopclose = () => {
      setBlockpop({
      open: false,
      blockid: "",
    });
  };
 // function for close delete popup
 const handlePopcloses = () => {
  setShowPop(false);
};

  const filterData = (srt) => {
    const inputSerch = users.filter((curName) =>
    curName.display_name.toLowerCase().startsWith(srt)
    );
    setInputSearch(inputSerch);
  };

  useEffect(() => {
    const fetchAllUser = async () => {
      const UsersQuery = query(
        collection(db, "users")
      );
      await onSnapshot(UsersQuery, (userSnapshot) => {
        const userarr = [];
        userSnapshot.docs.map((user) => {
          userarr.push({ ...user.data(), id: user.id });
        });
        setUsers(userarr);
        setInputSearch(userarr);
        setIsLoading(false)
      });
    };
    fetchAllUser();
  }, []);

  return (
    <>
      <Grid  container spacing={6}>
        <Grid item xs={12} md={8} >
          <TextField
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                marginBottom: 4,
                width:{xs:auto,sm:400}
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="right">
                  <Magnify fontSize="small" sx={{ marginLeft : 2}}/>
                </InputAdornment>
              ),
            }}
            placeholder={t("search.name")}
            onChange={(e) => filterData(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4} textAlign="right" sx={{ marginBottom: 4 }}>
          <Button variant="contained" onClick={(e) => {
                  handleClickOpens(e);
                }}>
            <Plus sx={{ marginRight: 1.5 }} />
            {t("employee.form.addBtn")}
          </Button>
        </Grid>
      </Grid>

      <Card>
      <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="table in dashboard">
          <TableHead>
              <TableRow>
                <TableCell>{t("user-detail.table.image")}</TableCell>
                <TableCell>{t("user-detail.table.name")}</TableCell>
                <TableCell align="center">{t("user-detail.table.email")}</TableCell>
                <TableCell align="center">{t("user-detail.table.department")}</TableCell>
                <TableCell align="center">{t("user-detail.table.phone")}</TableCell>
                <TableCell align="center">{t("table.action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {isLoading ?<TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    colSpan={5}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow> : inputSearch?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ).length !== 0 ? (
                  inputSearch?.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  ).map((item, index) => {
                    return (
                      <TableRow
                        hover
                        key={index}
                        sx={{
                          "&:last-of-type td, &:last-of-type th": {
                            border: 0,
                          },
                        }}
                      >
                         <TableCell component="th" scope="row">
                          <img
                            src={
                              item.photo_url ? item.photo_url : userProfile.src
                            }
                            height={50}
                            width={50}
                            style={{ borderRadius: "50px" }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            py: (theme) => `${theme.spacing(0.5)} !important`,
                          }}
                        >
                          {item.display_name}
                        </TableCell>
                        <TableCell align="center">{item.email}</TableCell>
                        {item.department ? <TableCell align="center">{item.department}</TableCell>:<TableCell align="center"><Typography variant="contained" style={{backgroundColor:"#a5a8fc", color:"white", padding:"5px", borderRadius:"4px"}}>
                              Admin
                            </Typography>
                            </TableCell>}
                        <TableCell align="center">{item.phone_number}</TableCell>
                        <TableCell align="center">
                          {/* <Button>
                            <Link
                              href={{
                                pathname: `user/${item.id}`,
                               
                              }}
                            >
                              <Eye titleAccess="View User" htmlColor="blue" />
                            </Link>
                          </Button>
                          <Button
                            onClick={() => {
                              setBlockpop({
                                open: true,
                                blockid: item.id,
                                isblock: item.IsBlock,
                              });
                            }}
                          >
                            {item.IsBlock === false ? (
                              <AccountLock  titleAccess="Block user" htmlColor="#02b702" />
                            ) : (
                              <AccountLock titleAccess="Block user" htmlColor="#ff0000" />
                            )}
                          </Button> */}
                          <IconButton
                onClick={(e) => {
                  handleClickOpen(e, item.id);
                }}
              >
                <Pencil  titleAccess={t("category.page.form.edit.Category")} htmlColor="blue" />
              </IconButton>
              <IconButton
                onClick={() => {
                  handlePopopen(item.id);
                }}
              >
                <Delete  titleAccess="Delete user" htmlColor="red" />
              </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableCell sx={{ textAlignLast: "center" }} colSpan={7}>
                   {t("resultnotfound")}
                  </TableCell>
                )}
            </TableBody>
          </Table>
      </TableContainer>   
      {inputSearch.length !== 0 && (
            <TablePagination
              labelRowsPerPage={t("table.rowperpage")}
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={inputSearch?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
      </Card>

      {/* Dialog for Block User  */}
      <BlockDialog
        Blockpop={Blockpop}
        setBlockpop={setBlockpop}
        handlePopclose={handlePopclose}
      />
      <DeleteDailog
        handleDelete={handleDelete}
        showPop={showPop}
        handlePopclose={handlePopcloses}
      />
      <UserForm
        open={open}
        handleClose={handleClose}
        CategoriesId={userId}
        type={type}
      />
      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
    </>
  );
}

export default user;
