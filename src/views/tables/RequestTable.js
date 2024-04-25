import {
  Badge,
  CircularProgress,
  Icon,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { AccountLock, AccountLockOpen, Eye, Phone, Delete, Pencil } from "mdi-material-ui";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useTranslation from "src/@core/hooks/useTranslation";
import { useRouter } from "next/router";
import BlockDailog from "../dailogs/BlockDailog";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "src/configs/firebaseConfig";
import DeleteDailog from "src/views/dailogs/DeleteDailog";
import AlertMessage from "src/views/Alert/AlertMessage";
import UserForm from "src/views/forms/RequestForm";




const UserTable = ({ children, loading, setLoading, type }) => {
  const { locale } = useRouter();
  const [userId, setUserId] = useState("");
  const [open, setOpen] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });

  const [Blockpop, setBlockpop] = useState({
    open: false,
    blockid: "",
    isblock: "",
  });
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleClickOpen = (_, id) => {
    setUserId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setUserId("");
    setOpen(false);
  };

  const handlePopopen = (serviceid, id) => {
    setUserId(serviceid);
    setShowPop(true);
  };
  // function for delete Service details
  const handleDelete = async () => {
    // delete service
    const deleteService = doc(db, "requests", userId);
    await deleteDoc(deleteService).then(() => {
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
    setLoading(true);
  };

  useEffect(() => {
    setUserId("")
  }, [children]);

  return (
    <>
      <Paper elevation={10}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">{t("request.guestName")}</TableCell>
                <TableCell align="center">{t("request.guestRM")}</TableCell>
                <TableCell align="center">{t("request.request")}</TableCell>
                <TableCell align="center">{t("request.status")}</TableCell>
                <TableCell align="center">{t("request.orderRes")}</TableCell>
                <TableCell align="center">{t("request.department")}</TableCell>
                <TableCell align="center">{t("request.guestCalled")}</TableCell>
                <TableCell align="center">{t("table.action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    colSpan={8}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : children.length == 0 ? (
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    colSpan={5}
                  >
                    {t("NoRecord")}
                  </TableCell>
                </TableRow>
              ) : (
                children
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((value) => (
                    <TableRow key={value.docid}>
                      <TableCell align="center">{value.guestName}</TableCell>
                      <TableCell align="center">{value.guestRM}</TableCell>
                      <TableCell align="center">{value.request}</TableCell>
                      <TableCell align="center">{value.status}</TableCell>
                      <TableCell align="center">{value.orderRes}</TableCell>
                      <TableCell align="center">{value.department}</TableCell>
                      <TableCell align="center" style={{padding:"0 10px"}}><Icon style={{overflow:"unset"}}>
                          {value.guestCalled ? (
                            <Badge badgeContent={value.followUp} color="primary">
                            <Phone color="success" />
                          </Badge>
                          ) : (
                            <Phone htmlColor="red" />
                          )}
                        </Icon></TableCell>
                        

                      {/* <TableCell>
                        {value.type !== "SP" ? (
                          ""
                        ) : value.subscriptionpackage ? (
                          ""
                        ) : (
                          <Switch
                            sx={{ color: "#9155FD" }}
                            checked={value.isAvailableCOD}
                            onClick={() =>
                              handleSwitch(value.uid, value.isAvailableCOD)
                            }
                          />
                        )}
                      </TableCell> */}
                      <TableCell align="center">
                        <IconButton>
                          <Link
                            passHref
                            href={`/user-detail/${value.uid}`}
                            locale={locale}
                          >
                            <Eye color="info" />
                          </Link>
                        </IconButton>
                        {/* <IconButton
                          onClick={() => {
                            setBlockpop({
                              open: true,
                              blockid: value.uid,
                              isblock: value.IsBlocked,
                            });
                          }}
                        >
                          {value.IsBlocked ? (
                            <AccountLock color="warning" />
                          ) : (
                            <AccountLockOpen color="success" />
                          )}
                        </IconButton> */}
                        <IconButton
                onClick={(e) => {
                  handleClickOpen(e, value.docid);
                }}
              >
                <Pencil htmlColor="blue" />
              </IconButton>
              <IconButton
                onClick={() => {
                  handlePopopen(value.docid);
                }}
              >
                <Delete htmlColor="red" />
              </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!children?.length ? (
          ""
        ) : (
          <TablePagination
            labelRowsPerPage={t("Rows per page")}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={children?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      <BlockDailog
        Blockpop={Blockpop}
        setBlockpop={setBlockpop}
        handlePopclose={handlePopclose}
      />
      <DeleteDailog
        handleDelete={handleDelete}
        showPop={showPop}
        handlePopclose={handlePopclose}
      />
      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
      <UserForm
        open={open}
        handleClose={handleClose}
        CategoriesId={userId}
      />
    </>
  );
};

export default UserTable;
