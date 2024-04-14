import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  Grid,
  TextField,
  Typography,Menu,Fade
} from "@mui/material";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import {
  Create_Update_Doc,
  imageUploading,
} from "src/@core/utils/firebaseutils";
import { db } from "src/configs/firebaseConfig";
import AlertMessage from "../Alert/AlertMessage";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { BorderAll, BorderColor } from "mdi-material-ui";

const Serviceform = (props) => {
  // ** States
  const [guestName, setguestName] = useState();
  const [guestRM, setguestRM] = useState();
  const [orderTaker, setorderTaker] = useState();
  const [request, setrequest] = useState();
  const [orderRes, setorderRes] = useState();
  const [department, setdepartment] = useState();
  const [status, setStatus] = useState();
  const [requestDoneTime, setRequestDoneTime] = useState();
  const [responseTime, setResponseTime] = useState();
  const [guestCalled, setguestCalled] = useState();
  const [followUp, setfollowUp] = useState();
 const departmentType = ["House keeping" ,"Engineering" ,"Room Service" ,"Security" ,"General"];

  // const [imageAsFile, setImageAsFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [file, setFile] = useState();
  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // state for error handle
  const [errorMessage, setErrorMessage] = useState({
    nameerror: "",
    imageerror: "",
  });

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  // ** Add Subscription Packages
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    guestName = guestName.trim();
    orderTaker = orderTaker.trim();
    request = request.trim();
    orderRes = orderRes.trim();
    department = department.trim();

    if (!guestName) {
      setIsLoading(false);
      setErrorMessage({
        nameerror: t("forms.errormessage.inputText"),
      });
    // } else if (!imageAsFile && !file) {
    //   setIsLoading(false);
    //   setErrorMessage({
    //     imageerror: t("forms.errormessage.inputfile"),
    //   });
    }else if (!guestRM) {
      setIsLoading(false);
      setErrorMessage({
        nameerror: t("forms.errormessage.inputText"),
      });
    } else {
      // imageUploading("photo_url", imageAsFile).then((firebase_url) => {
      //   if (imageAsFile) {
      //     file = firebase_url;
      //   }

        Create_Update_Doc(
          "requests",
          { guestName: guestName, guestRM: guestRM, orderTaker: orderTaker, department: department, request: request, orderRes: orderRes, created_At: new Date(), status: status ,requestDoneTime: requestDoneTime , responseTime:responseTime ,guestCalled:guestCalled , followUp:followUp },
          props.CategoriesId
        ).then((action_message) => {
          props.handleClose();

          // Insert Alert
          setAlertpop({
            open: true,
            message: t(action_message),
          });
        });
      };
    };

  // const handleDelete = async () => {
  //   await deleteDoc(doc(db, "users", props.CategoriesId)).then(() => {
  //     props.handleClose();

  //     // Delete Alert
  //     setAlertpop({
  //       open: true,
  //       message: t("data.delete"),
  //     });
  //   });
  // };

  useEffect(() => {
    setErrorMessage("");
    setguestName("");
    setguestRM("");
    setdepartment("");
    setorderRes("");
    setrequest("");
    setorderTaker("");
    // setImageAsFile("");
    // setFile("");
    setIsLoading(false);

    const fetchserviceDetail = async () => {
      const docRef = doc(db, "requests", props.CategoriesId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setguestName(data.guestName);
        setguestRM(data.guestRM);
        setdepartment(data.department);
        setorderRes(data.orderRes);
        setrequest(data.request);
        setorderTaker(data.orderTaker);
        setfollowUp(data.followUp);
        setguestCalled(data.guestCalled);
        setResponseTime(data.responseTime);
        setRequestDoneTime(data.requestDoneTime);        
        setStatus(data.status);

        // setFile(data.photo_url);
      }
    };

    if (props.CategoriesId) {
      fetchserviceDetail();
    }
  }, [props.open]);

  return (
    <>
      <Dialog open={props.open} >
        <Card style={{ overflowY:"auto"}}>
          <CardHeader
            title={
              props.CategoriesId
                ? t("category.page.form.edit.Category")
                : t("category.page.form.add.Category")
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label={t("user-detail.table.name")}
                    value={guestName}
                    style={{ marginBottom: "15px" }}
                    helperText={
                      errorMessage.nameerror ? errorMessage.nameerror : ""
                    }
                    error={errorMessage.nameerror ? true : false}
                    onChange={(e) => {
                      setguestName(e.target.value);
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t("user-detail.table.name")}
                    value={guestName}
                    style={{ marginBottom: "15px" }}
                    helperText={
                      errorMessage.nameerror ? errorMessage.nameerror : ""
                    }
                    error={errorMessage.nameerror ? true : false}
                    onChange={(e) => {
                      setguestName(e.target.value);
                    }}
                  />
                  <TextField
                  fullWidth
                  label={t("user-detail.table.email")}
                  value={guestRM}
                  style={{ marginBottom: "15px" }}
                  helperText={
                    errorMessage.nameerror ? errorMessage.nameerror : ""
                  }
                  error={errorMessage.nameerror ? true : false}
                  onChange={(e) => {
                    setguestRM(e.target.value);
                  }}
                />
              <Select
                open={open}
                style={{ marginBottom: "15px" }}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                value={department}
                label={t("user-detail.table.type")}
                onChange={(e) => setdepartment(e.target.value)}
              >
                {departmentType.map((e,i)=>{
                <MenuItem onClick={handleClose} value={e} key={i}>{e}</MenuItem>
                })}
              </Select>
              <TextField
              fullWidth
              label={t("user-detail.table.orderRes")}
              value={orderRes}
              style={{ marginBottom: "15px" }}
              helperText={
                errorMessage.nameerror ? errorMessage.nameerror : ""
              }
              error={errorMessage.nameerror ? true : false}
              onChange={(e) => {
                setorderRes(e.target.value);
              }}
            /><TextField
            fullWidth
            label={t("user-detail.table.request")}
            value={request}
            style={{ marginBottom: "15px" }}
            helperText={
              errorMessage.nameerror ? errorMessage.nameerror : ""
            }
            error={errorMessage.nameerror ? true : false}
            onChange={(e) => {
              setrequest(e.target.value);
            }}
          /><TextField
          fullWidth
          label={t("user-detail.table.phone")}
          value={orderTaker}
          style={{ marginBottom: "15px" }}
          helperText={
            errorMessage.nameerror ? errorMessage.nameerror : ""
          }
          error={errorMessage.nameerror ? true : false}
          onChange={(e) => {
            setorderTaker(e.target.value);
          }}
        />
                </Grid>
                {/* <Grid item xs={12} display="flex" gap="1rem">
                  <Button variant="contained" component="label">
                    {t("form.lables.Choose File")}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        setErrorMessage("");
                        setImageAsFile((imageFile) => e.target.files[0]);
                        setFile(URL.createObjectURL(e.target.files[0]));
                      }}
                    />
                  </Button>
                  <Typography variant="body2" color="red" alignSelf="center">
                    {errorMessage.imageerror ? errorMessage.imageerror : ""}
                  </Typography>
                </Grid> */}
                {/* {file ? (
                  <Grid item xs={12} textAlign="center">
                    <img
                      src={file}
                      alt="preview of seleted image"
                      height="150px"
                      style={{ borderRadius: "10px" }}
                    />
                  </Grid>
                ) : (
                  ""
                )} */}
                <Grid item xs={12}>
                  {isLoading ? (
                    <Button size="large" sx={{ marginRight: 4 }}>
                      <CircularProgress />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ marginRight: 4 }}
                    >
                      {props.CategoriesId
                        ? t("forms.btn.Update")
                        : t("forms.btn.Submit")}
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setErrorMessage("");
                      setguestName("");
                      // setImageAsFile("");
                      // setFile("");
                      setIsLoading(false);
                      props.handleClose();
                    }}
                  >
                    {t("forms.btn.Cancel")}
                  </Button>
                  {/* {props.CategoriesId ? (
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ float: "right" }}
                      size="large"
                      onClick={() => {
                        handleDelete();
                      }}
                    >
                      {t("forms.btn.Delete")}
                    </Button>
                  ) : (
                    ""
                  )} */}
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Dialog>
      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
    </>
  );
};

export default Serviceform;
