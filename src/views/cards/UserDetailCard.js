import React, { useEffect, useState } from "react";

// ** MUI Imports
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { RoundedCorner, Star } from "mdi-material-ui";
import useTranslation from "src/@core/hooks/useTranslation";
import { db } from "src/configs/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@mui/material";
const Detail = ({ lable, userDetails }) => {
  return (
    <Box sx={{ display: "flex", gap: "0.5rem" }}>
      <Typography variant="body1">{lable}:-</Typography>
      <Typography variant="body1" display="flex" alignItems="center">
        {userDetails}
      </Typography>
    </Box>
  );
};

const UserDetailCard = ({ userDetails, primeDetail }) => {
  const { t } = useTranslation();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isCOD, setIsCOD] = useState("");
  const [subscriptionState, SetSubscriptionState] = useState(null);
  const [checkedValue, setCheckedValue] = useState(userDetails.IsavailableCOD);
  
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const details = navigator.userAgent;
      const regexp = /android|iphone|kindle|ipad/i;
      const _isMobileDevice = regexp.test(details);
      setIsMobileDevice(_isMobileDevice);
    }
    if (userDetails.usertype === "SP") {
      SetSubscriptionState(userDetails.subscriptionpackage);
    }
  }, []);

  // const supplierRef = collection(db, "user", )
  // onSnapshot(supplierRef,(suppSnap)=>{
  //   suppSnap.docs.map((item)=>{
  //     if (item.data() && item.data().usertype == "Supplier") {
  //       // console.log("item==============", item.data());
  //     }
  //   })
  // })

  const handleSwitch = (id) => {
    setCheckedValue(!checkedValue);
    const SupplierStatus = doc(db, "users", id);
    updateDoc(SupplierStatus, {
      IsavailableCOD: !checkedValue,
    });
  };

  return (
    <>
      <Grid container spacing={6} justifyContent="space-between">
        <Grid
          item
          sx={{ marginTop: 4.8, marginBottom: 3 }}
          display="flex"
          gap="1.5rem"
          flexDirection={isMobileDevice ? "column" : "row"}
          alignItems="center"
        >
          {userDetails.photo_url ? (
            <Box sx={{ margin: "auto" }}>
              <img
                src={userDetails.photo_url}
                alt="Profile Pic"
                width={150}
                height={150}
                style={{ borderRadius: "10px" }}
              />
            </Box>
          ) : null}
          {userDetails.TradeLicense ? (
            <Box sx={{ margin: "auto" }}>
              <img
                src={userDetails.TradeLicense[0]}
                alt="License Pic"
                width={150}
                height={150}
                style={{ borderRadius: "10px" }}
              />
            </Box>
          ) : null}
        </Grid>
        <Grid
          item
          sx={{ marginTop: 4.8, marginBottom: 3 }}
          display="flex"
          gap="1.5rem"
          flexDirection={isMobileDevice ? "column" : "row"}
          alignItems="center"
        >
          <Box>
            <Typography variant="body1">
              <Detail
                lable={t("user-detail.table.name")}
                userDetails={userDetails?.display_name}
              />
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <Detail
                lable={t("user-detail.table.email")}
                userDetails={userDetails?.email}
              />
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <Detail
                lable={t("user-detail.table.phone")}
                userDetails={userDetails?.phone_number}
              />
            </Typography>
            {userDetails?.address ? (
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                <Detail
                  lable={t("user-detail.table.address")}
                  userDetails={userDetails?.address}
                />
              </Typography>
            ) : null}
            {userDetails?.city ? (
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                <Detail
                  lable={t("user-detail.table.city")}
                  userDetails={userDetails?.city}
                />
              </Typography>
            ) : null}
            <Typography>
              {t("supplier.cash.on.delivery")}:-{" "}
              {subscriptionState ? (
                <Button
                  sx={{ backgroundColor: "grey.400", color: "white" }}
                  disabled
                >
                  {t("supplier.access.denied")}
                </Button>
              ) : (
                // <Switch disabled />
                // <Typography variant="body1" sx={{ marginTop: 2 }}>
                <Button
                  // checked={checkedValue ? true : false}
                  onClick={() =>
                    handleSwitch(userDetails.uid, userDetails.IsavailableCOD)
                  }
                  sx={{
                    backgroundColor: checkedValue ? "green" : "red",
                    color: "white",
                    marginLeft: "10px",
                    "&:hover": {
                      backgroundColor: checkedValue ? "green" : "red",
                    },
                  }}
                >
                  {checkedValue
                    ? `${t("supplier.button.applied")}`
                    : `${t("supplier.button.not.applied")}`}
                </Button>
                // </Typography>
              )}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          sx={{ marginTop: 4.8, marginBottom: 3 }}
          display="flex"
          gap="1.5rem"
          flexDirection={isMobileDevice ? "column" : "row"}
          alignItems="center"
        >
          {userDetails?.usertype == "Supplier" ? (
            <>
              <Box>
                <Box sx={{ textShadow: "0 0 black" }} textAlign="left">
                  {t("supplier.bank.details")}
                </Box>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <Detail
                    lable={t("supplier.bank.account.holder.name")}
                    userDetails={userDetails?.BankData?.AccountHolderName}
                  />
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <Detail
                    lable={t("supplier.bank.account.number")}
                    userDetails={userDetails?.BankData?.AccountNumber}
                  />
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <Detail
                    lable={t("supplier.bank.name")}
                    userDetails={userDetails?.BankData?.BankName}
                  />
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <Detail
                    lable={t("supplier.ifsc.code")}
                    userDetails={userDetails?.BankData?.IFSCCode}
                  />
                </Typography>
              </Box>
            </>
          ) : null}
        </Grid>
        <Grid
          item
          sx={{ marginTop: 4.8, marginBottom: 3 }}
          display="flex"
          gap="1.5rem"
          flexDirection={isMobileDevice ? "column" : "row"}
          alignItems="center"
        >
          {userDetails?.usertype == "Supplier" ? (
            <>
              <Box>
                <Box sx={{ textShadow: "0 0 black" }} textAlign="left">
                  {t("supplier-detail.page.subscription.title")}
                </Box>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <Detail
                    lable={t("supplier-detail.page.subscription.Name")}
                    userDetails={primeDetail?.primename}
                  />
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <Detail
                    lable={t("supplier-detail.page.subscription.Start")}
                    userDetails={
                      primeDetail?.current_period_start &&
                      new Date(
                        primeDetail?.current_period_start.seconds * 1000
                      ).toDateString()
                    }
                  />
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <Detail
                    lable={t("supplier-detail.page.subscription.Price")}
                    userDetails={primeDetail?.primeprice}
                  />
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <Detail
                    lable={t("supplier-detail.page.subscription.End")}
                    userDetails={
                      primeDetail?.current_period_end &&
                      new Date(
                        primeDetail?.current_period_end.seconds * 1000
                      ).toDateString()
                    }
                  />
                </Typography>
              </Box>
            </>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

export default UserDetailCard;
