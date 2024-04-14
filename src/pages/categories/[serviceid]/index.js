import { CircularProgress, Grid, Typography } from "@mui/material";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useTranslation from "src/@core/hooks/useTranslation";
import { db } from "src/configs/firebaseConfig";
import AlertMessage from "src/views/Alert/AlertMessage";
import SubCategoryCard from "src/views/cards/SubCategoryCard";
import DeleteDailog from "src/views/dailogs/DeleteDailog";

import SubServiceForm from "src/views/forms/SubServiceForm";

const SubCategories = () => {
  const router = useRouter();
  const { serviceid } = router.query;
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subCategoryId, setSubCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [openSubService, setOpenSubService] = useState(false);
  const [showPop, setShowPop] = useState(false);

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const { t } = useTranslation();

  const handleClickOpen = (_, id) => {
    setSubCategoryId(id);
    setOpenSubService(true);
  };

  const handleClose = () => {
    setSubCategoryId("");
    setOpenSubService(false);
  };

  // function for open delete popup
  const handlePopopen = (id) => {
    setSubCategoryId(id);
    setShowPop(true);
  };

  // function for close delete popup
  const handlePopclose = () => {
    setShowPop(false);
  };

  // function for delete Service details
  const handleDelete = async () => {
    // delete service
    const deleteService = doc(
      db,
      "category",
      serviceid,
      "SubCategory",
      subCategoryId
    );
    await deleteDoc(deleteService).then(async () => {
      setShowPop(false);
      setSubCategoryId("");

      // Delete Alert
      setAlertpop({
        open: true,
        message: t("data.delete"),
      });
    });
  };

  useEffect(() => {
    const categoryQuery = collection(db, "category");
    onSnapshot(categoryQuery, (categorySnapshot) => {
      setCategories(
        categorySnapshot.docs.map((category) => ({
          docid: category.id,
          ...category.data(),
        }))
      );
    });

    if (serviceid) {
      const subCategoryqoery = collection(
        db,
        "category",
        serviceid,
        "SubCategory"
      );
      onSnapshot(subCategoryqoery, (querySnapshot) => {
        setSubCategories(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            subCategoryid: doc.id,
          }))
        );
        setLoading(false);
      });
    }
  }, [router.isReady]);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant="h5">{t("category.page.subcategory")}</Typography>
        </Grid>

        {loading ? (
          <Grid item xs={12} textAlign="center">
            <CircularProgress />
          </Grid>
        ) : // check Sub categories length
        !subCategories.length ? (
          <Grid item xs={12} textAlign="center">
            <Typography variant="h5">{t("NoRecord")} </Typography>
          </Grid>
        ) : (
          // return Sub categories data in card
          subCategories.map((value, i) => (
            <SubCategoryCard
              key={i}
              value={value}
              handleClickOpen={handleClickOpen}
              handlePopopen={handlePopopen}
            />
          ))
        )}
      </Grid>

      {/* Dialog for delete User */}
      <DeleteDailog
        handleDelete={handleDelete}
        showPop={showPop}
        handlePopclose={handlePopclose}
      />

      <SubServiceForm
        openSubService={openSubService}
        handleClose={handleClose}
        categories={categories}
        subCategoryId={subCategoryId}
        CategoryId={serviceid}
      />

      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
    </>
  );
};

export default SubCategories;
