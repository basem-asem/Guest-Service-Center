import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "src/configs/firebaseConfig";
import { Plus } from "mdi-material-ui";
import useTranslation from "src/@core/hooks/useTranslation";
import CategoryCard from "src/views/cards/CategoryCard";
import { getStaticData } from "src/@core/utils/firebaseutils";
import Serviceform from "src/views/forms/Serviceform";
import AlertMessage from "src/views/Alert/AlertMessage";
import SubService from "src/views/forms/SubServiceForm";
import DeleteDailog from "src/views/dailogs/DeleteDailog";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [CategoriesId, setCategoriesId] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showPop, setShowPop] = useState(false);

  const [Alertpop, setAlertpop] = useState({
    open: false,
    message: "",
  });
  const [openSubService, setOpenSubService] = useState(false);
  const { t } = useTranslation();

  const handleClickOpen = (_, id) => {
    setCategoriesId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setCategoriesId("");
    setOpen(false);
    setOpenSubService(false);
  };

  // function for delete Service details
  const handleDelete = async () => {
    // delete service
    const deleteService = doc(db, "category", CategoriesId);
    await deleteDoc(deleteService).then(() => {
      setShowPop(false);
      setCategoriesId("");

      // Delete Alert
      setAlertpop({
        open: true,
        message: t("data.delete"),
      });
    });
  };

  // function for close delete popup
  const handlePopclose = () => {
    setShowPop(false);
  };

  // function for open delete popup
  const handlePopopen = (serviceid, id) => {
    setCategoriesId(serviceid);
    setShowPop(true);
  };

  useEffect(() => {
    getStaticData("category").then((allCategories) => {
      setCategories(allCategories);
      setLoading(false);
    });
  }, [open, showPop]);

  return (
    <>
      <Grid container spacing={6} justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">{t("navbar.Hotels Category")}</Typography>
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
            {t("category.page.btn.newcategory")}
          </Button>
          {/* <Button variant="contained" onClick={() => setOpenSubService(true)}>
            <Plus sx={{ marginRight: 1.5 }} />
            {t("category.page.btn.newsubcategory")}
          </Button> */}
        </Grid>
      </Grid>

      {loading ? (
        <Grid item xs={12} textAlign="center">
          <CircularProgress />
        </Grid>
      ) : // check categories length
      !categories.length ? (
        <Grid item xs={12} textAlign="center">
          <Typography variant="h5">{t("NoRecord")} </Typography>
        </Grid>
      ) : (
        // return categories data in card
        <Grid container spacing={6}>
          {categories.map((value, i) => (
            <CategoryCard
              key={i}
              handleClickOpen={handleClickOpen}
              value={value}
              handlePopopen={handlePopopen}
            />
          ))}
        </Grid>
      )}

      <Serviceform
        open={open}
        handleClose={handleClose}
        CategoriesId={CategoriesId}
      />

      {/* Dialog for delete User */}
      <DeleteDailog
        handleDelete={handleDelete}
        showPop={showPop}
        handlePopclose={handlePopclose}
      />

      <SubService
        openSubService={openSubService}
        handleClose={handleClose}
        categories={categories}
      />

      <AlertMessage setAlertpop={setAlertpop} Alertpop={Alertpop} />
    </>
  );
};

export default Categories;
