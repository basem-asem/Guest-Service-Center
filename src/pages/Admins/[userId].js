import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "src/configs/firebaseConfig";
import {
  collection,
  query,
  onSnapshot,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import userProfile from "public/images/logos/userProfile.png";
import UserOrderList from "../../views/tables/UserOrderList";
import { CircularProgress } from "@mui/material";
import useTranslation from "src/@core/hooks/useTranslation";

function userId() {
  const router = useRouter();
  const { userId } = router.query;
  const [User, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [userOrderData, setUserOrderData] = useState([]);
  const { t } = useTranslation(router?.locale);

  const userOrderRef = collection(db, "Orders");

  const fetchData = async () => {
    const usersCollectionRef = doc(db, "users", userId);
    const docSnap = await getDoc(usersCollectionRef);
    if (docSnap.exists()) {
      setUser(docSnap.data());
      if (docSnap.data().selectedAddress) {
        const userAddressSnap = await getDoc(docSnap.data().selectedAddress);
        setUser({ ...docSnap.data(), selectedAddress: userAddressSnap.data() });
      }
      setIsLoading(false);
    } else {
      console.log("No such document!");
      setIsLoading(false);
    }
    const data = query(userOrderRef, where("customer", "==", usersCollectionRef));
    onSnapshot(data, (querySnapshot) => {
      const productOrderarr = [];
      querySnapshot.docs.map(async (doc) => {
        productOrderarr.push({ ...doc.data(), id: doc.id });
      });
      setUserOrderData(productOrderarr);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  return (
    <>
      {isLoading ? (
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Card>
            <CardContent>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", fontSize: "2rem" }}
              >
                {t("user.userdetails.title")}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} sx={{ textAlign: "center" }}>
                  <img
                    src={User.photo_url ? User.photo_url : userProfile.src}
                    alt="Profile Pic"
                    width={150}
                    height={150}
                    style={{ borderRadius: "10px", marginRight: "1.5rem" }}
                  />
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Typography variant="body1" sx={{ marginTop: 3 }}>
                  {t("user.name")} : {User.display_name ? User.display_name : "Not Found"}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 3 }}>
                  {t("user.email")} : {User.email ? User.email : "Not Found"}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 3 }}>
                  {t("user.phone")} :{" "}
                    {User.phone_number ? User.phone_number : "Not Found"}
                  </Typography>
                  {/* <Typography variant="body1" sx={{ marginTop: 3 }}>
                    {t("user.address")} : {User.address ? User.address : "Not Found"}
                  </Typography> */}
                  {/* <Typography variant="body1" sx={{ marginTop: 3 }}>
                    {t("user.whatsapp")} : {User.whatsapp_number ? User.whatsapp_number : "Not Found"}
                  </Typography> */}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <UserOrderList UserOrderList={userOrderData}></UserOrderList>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}

export default userId;
