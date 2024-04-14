import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { db } from "src/configs/firebaseConfig";
import UserDetailCard from "src/views/cards/UserDetailCard";
import HotelsTable from "src/views/tables/HotelsTable";
import UserOrders from "src/views/tables/UserOrders";

const UserDetail = () => {
  const {
    query: { userid },
  } = useRouter();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [primeDetail, setPrimeDetail] = useState();
  const [hotels, setHotels] = useState([]);
  const { t } = useTranslation();

  useEffect(async () => {
    if (userid) {
      const userRef = doc(db, "users", userid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const { type } = userSnap.data();
  console.log(type);

        if (type === "User") {
          // Users Booking Details fetch
          const bookingQuery = query(
            collection(db, "Services"),
            where("user", "==", userid)
            );
            onSnapshot(bookingQuery, (bookingSnaps) => {
              setBookings(
                bookingSnaps.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }))
                );
            });
            console.log(bookingQuery);

        } else if (type === "SP") {
          //mycode here..
          // SetSubscriptionState(subscriptionpackage);
          // Subscription package Details fetch
          const primeQuery = query(
            collection(db, "Bookings", userid, "subscriptions"),
            where("status", "==", "Pending")
            );
            const querySnapshot = await getDocs(primeQuery);
            
            if (querySnapshot.docs[0]) {
              const packageData = querySnapshot.docs[0].data();
              const docSnap = await getDoc(packageData.product);
              if (docSnap.exists()) {
                setPrimeDetail({
                  primename: docSnap.data().name,
                  primeprice: packageData.items[0].price.unit_amount,
                  ...packageData,
              });
            }
          }

          // Supplier Booking Details fetch
          const bookingQuery = query(
            collection(db, "Services"),
            where("user", "==", userRef)
          );
          onSnapshot(bookingQuery, (bookingSnaps) => {
            setBookings(
              bookingSnaps.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              );
          });
          // Supplier Hotels Details fetch
          const productQuery = query(
            collection(db, "Services"),
            where("user", "==", userRef)
            );
            onSnapshot(productQuery, (orderSnaps) => {
              setHotels(
                orderSnaps.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }))
                );
              });
            }

            setUserDetail(userSnap.data());
            setLoading(false);
          }
    }
  }, [userid]);
  return (
    <div>
      {!loading ? (
        <>
          {/* card title */}
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ marginBottom: 4 }}
            >
            <Grid item>
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                {userDetail?.type == "User"
                  ? t("user.detail.title.user")
                  : null}
                {userDetail?.type == "SP"
                  ? t("user.detail.title.supplier")
                  : null}
              </Typography>
            </Grid>
            <Grid item textAlign="right">
              {userDetail?.rating ? (
                <Rating name="read-only" value={userDetail.rating} readOnly />
              ) : null}
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              {/* detail of user */}
              <UserDetailCard
                userDetails={userDetail}
                primeDetail={primeDetail}
              />
            </CardContent>
          </Card>

          {/* table of order detail */}
          <UserOrders userOrder={bookings} type={userDetail?.type} />

          {/* Product of Supplier */}
          {userDetail?.type == "SP" ? (
            <HotelsTable hotels={hotels} />
          ) : null}
        </>
      ) : (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default UserDetail;
