import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  Grid,
  TextField,
  Typography,Menu,Fade,FormControl, InputLabel,Select,MenuItem,Autocomplete
} from "@mui/material";
import { deleteDoc, doc, getDoc, getDocs, query,collection,where ,onSnapshot} from "firebase/firestore";
import { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import {
  Create_Update_Doc,
  imageUploading,
} from "src/@core/utils/firebaseutils";
import { db } from "src/configs/firebaseConfig";
import AlertMessage from "../Alert/AlertMessage";
import { BorderAll, BorderColor } from "mdi-material-ui";
import Cookies from "js-cookie";

const RequestForm = (props) => {
  // ** States
  const [guestName, setguestName] = useState('');
  const [guestRM, setguestRM] = useState('');
  const [request, setrequest] = useState('');
  const [department, setdepartment] = useState();
  const [status, setStatus] = useState('');
  const [requestDoneTime, setRequestDoneTime] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [guestCalled, setguestCalled] = useState(false);
  const [followUp, setfollowUp] = useState(0);
  const departmentType = ["House keeping", "Engineering", "Room Service", "Security", "General"];
  const statusType = ["Pending","Work on it", "Completed"];
const orderTakerId = Cookies.get("_isAdmin");
  // const [imageAsFile, setImageAsFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [file, setFile] = useState();
  const [open, setOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [statusOpen, setStatudOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setdepartment(event.currentTarget);
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
    request = request.trim();
    department = department.trim();
    !props.CategoriesId?status="Pending":status=status
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
          { guestName: guestName, guestRM: guestRM, orderTaker: orderTakerId, department: department, request: request, orderRes: selectedUser, created_At: new Date(), status:!props.CategoriesId?"Pending":status
          ,requestDoneTime: requestDoneTime , responseTime:responseTime ,guestCalled:guestCalled , followUp:followUp },
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
    setrequest("");
    // setImageAsFile("");
    // setFile("");
    setIsLoading(false);        
    setStatus("");


    const fetchserviceDetail = async () => {
      const docRef = doc(db, "requests", props.CategoriesId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userDoc = await getDoc(doc(db, "users", data.orderRes));
        const userData = userDoc.data();
        console.log(userData.display_name)
        setguestName(data.guestName);
        setguestRM(data.guestRM);
        setdepartment(data.department);
        setrequest(data.request);
        setfollowUp(data.followUp);
        setguestCalled(data.guestCalled);
        setResponseTime(data.responseTime);
        setRequestDoneTime(data.requestDoneTime);        
        setStatus(data.status);
        setSelectedUser(userData.display_name)
      }
    };
    if (props.CategoriesId) {
      fetchserviceDetail();
    }
  }, [props.open]);
  useEffect(() => {
    const fetchUser = async () => {
      const querySnapshot = await getDocs(
   query(collection(db, "users"),where("Role" , "==", "Employee"), where("department", "==", department))
  );
  const fetchedUsers = querySnapshot.docs.map((doc) => ({
   id: doc.id,
   ...doc.data(),
  }));
  setUsers(fetchedUsers);
  };
  if (department) {
    fetchUser();
  }
  }, [department]);
  return (
    <>
      <Dialog open={props.open} fullWidth={true} maxWidth={"lg"}>
        <Card style={{ overflowY:"auto"}}>
          <CardHeader
            title={
              props.CategoriesId
                ? t("request.page.form.edit.request")
                : t("request.page.form.add.request")
            }
            titleTypographyProps={{ variant: "h6" }}
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label={t("request.guestName")}
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
                    label={t("request.guestRM")}
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
               <Grid container spacing={2}>
  <Grid item xs={5}>
    <FormControl fullWidth>
                <InputLabel id="demo-controlled-open-select-label">
                      {t("request.department")}
                    </InputLabel>
             <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={open}
                style={{ marginBottom: "15px" }}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                value={department}
                label={t("request.department")}
                onChange={(e) => setdepartment(e.target.value)}>
                {departmentType.map((e, i) => (
                  <MenuItem onClick={()=>handleClick(e)}value={e} key={i}>
                    {e}
                  </MenuItem>
                ))}
              </Select>
                </FormControl>
                </Grid>
  <Grid item xs={5}>
                  {department && <Autocomplete
                    options={users}
                    getOptionLabel={(user) => user.display_name} // Assuming the user object has a "name" property
                    value={selectedUser ? selectedUser.display_name : null}
                    onChange={(event, newValue) => {
                      setSelectedUser(newValue.id);
                    }}
                    renderInput={(params) => <TextField {...params}  label="Select User" />}
                  />}
                   </Grid>
              <Grid item xs={2}>{props.CategoriesId && <FormControl>
                <InputLabel id="demo-controlled-open-select-label" >
                      {t("request.status")}
                    </InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={statusOpen}
              onClose={() => setStatudOpen(false)}
              onOpen={() => setStatudOpen(true)}
              value={status}
              label={t("request.status")}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusType.map((e, i) => (
                <MenuItem onClick={handleClose} value={e} key={i}>
                  {e}
                </MenuItem>
              ))}
            </Select>
            </FormControl>}
</Grid>
</Grid>
            <TextField
            fullWidth
            label={t("request.request")}
            value={request}
            style={{ margin: "15px 0" }}
            helperText={
              errorMessage.nameerror ? errorMessage.nameerror : ""
            }
            error={errorMessage.nameerror ? true : false}
            onChange={(e) => {
              setrequest(e.target.value);
            }}
          />
         <Grid container spacing={2}>
      <Grid item sm={6} xs={12} style={{ marginBottom: "15px" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-controlled-open-select-label">
          {t("request.guestCalled")}
          </InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={callOpen}
            onClose={() => setCallOpen(false)}
            onOpen={() => setCallOpen(true)}
            value={guestCalled}
            label={t("request.guestCalled")}
            onChange={(e) => setguestCalled(e.target.value)}
          >
            <MenuItem value={false}>No</MenuItem>
            <MenuItem value={true}>Yes</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item sm={6} xs={12}>
        <TextField
          fullWidth
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*',min: 0 }}
          type="number"
          label={t("request.followUp")}
          value={followUp}
          helperText={errorMessage.nameerror ? errorMessage.nameerror : ''}
          error={errorMessage.nameerror ? true : false}
          onChange={(e) => {
            setfollowUp(e.target.value);
          }}
        />
      </Grid>
    </Grid>
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
                 
                </Grid>
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

export default RequestForm;
