import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Typography, Grid, Box, Chip } from "@mui/material";
import { useRouter } from "next/router";
import useTranslation from "src/@core/hooks/useTranslation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Detail = ({ label, userDetails }) => {
  return (
    <Box sx={{ display: "flex", gap: "0.5rem" }}>
      <Typography variant="body1">{label}:-</Typography>
      <Typography variant="body1" display="flex" alignItems="center">
        {userDetails}
      </Typography>
    </Box>
  );
};

const UserDetailCard = forwardRef(({ userDetails }, ref) => {
  const { t } = useTranslation();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [print, setprint] = useState(false);
  const router = useRouter();
  const statusObj = {
    Accepted: { color: "info" },
    Cancelled: { color: "error" },
    Pending: { color: "warning" },
    Completed: { color: "success" },
  };

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const details = navigator.userAgent;
      const regexp = /android|iphone|kindle|ipad/i;
      setIsMobileDevice(regexp.test(details));
    }
  }, []);

  const downloadPDF = () => {
    setprint(true)
    const capture = document.querySelector('.actual-receipt');
    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL('img/png');
      const doc = new jsPDF('landscape', 'mm', 'a4');
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = 100;
      console.log(componentWidth, componentHeight)
      doc.addImage(imgData, 'PNG', 0, 50, componentWidth, componentHeight);
      doc.save('receipt.pdf');
    });
    setprint(false)
  };

  useImperativeHandle(ref, () => ({
    downloadPDF,
  }));

  return (
    <Grid container spacing={6} justifyContent="space-between" className="actual-receipt">
      <Grid item sx={{ marginTop: 4.8, marginBottom: 3 }} display="flex" gap="1.5rem" flexDirection={isMobileDevice ? "column" : "row"} alignItems="center">
        <Box>
          <Typography variant="body1">
            <Detail label={t("request.guestName")} userDetails={userDetails?.guestName} />
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <Detail label={t("request.guestRM")} userDetails={userDetails?.guestRM} />
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <Detail label={t("request.orderRes")} userDetails={userDetails?.orderRes} />
          </Typography>
        </Box>
      </Grid>
      <Grid item sx={{ marginTop: 4.8, marginBottom: 3 }} display="flex" gap="1.5rem" flexDirection={isMobileDevice ? "column" : "row"} alignItems="center">
        <Box>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <Box display="flex" gap={2}>
              <Typography variant="body1">{t("request.status")}:-</Typography>
              <Chip
                label={router.locale == "en" ? userDetails?.status : userDetails?.status.replace("Pending", "معلق").replace("Accepted", "مقبولة").replace("On its way", "في الطريق اليك").replace("Delivered", "تم التوصيل").replace("Completed", "اكتمل").replace("Canceled", "ملغاة")}
                color={statusObj[userDetails?.status]?.color}
                sx={{ height: 24, fontSize: "0.75rem", textTransform: "capitalize", "& .MuiChip-label": { fontWeight: 500 } }}
              />
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <Detail label={t("request.createdAt")} userDetails={new Date(userDetails?.created_At * 1000).toDateString()} />
          </Typography>
          {(userDetails?.status == "Work on it" || userDetails?.status == "Completed") && (
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <Detail label={t("request.createdAt")} userDetails={new Date(userDetails?.responseTime * 1000).toDateString()} />
            </Typography>
          )}
          {userDetails?.status == "Completed" && (
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <Detail label={t("request.createdAt")} userDetails={new Date(userDetails?.requestDoneTime * 1000).toDateString()} />
            </Typography>
          )}
          {userDetails?.city && (
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              <Detail label={t("user-detail.table.city")} userDetails={userDetails?.city} />
            </Typography>
          )}
        </Box>
      </Grid>
      <Grid item sx={{ marginTop: 4.8, marginBottom: 3 }} display="flex" gap="1.5rem" flexDirection={isMobileDevice ? "column" : "row"} alignItems="center">
        <Box>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <Detail label={t("request.orderTaker")} userDetails={userDetails?.orderTaker} />
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <Detail label={t("request.department")} userDetails={router.locale == "en" ? userDetails?.department : userDetails?.departmentAR} />
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <Detail label={t("request.request")} userDetails={router.locale == "en" ? userDetails?.request : userDetails?.requestAR} />
          </Typography>
        </Box>
      </Grid>
      <Grid item sx={{ marginTop: 4.8, marginBottom: 3, marginRight:3  }} display="flex" gap="1.5rem" flexDirection={isMobileDevice ? "column" : "row"} alignItems="center">
        <Box>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <Detail label={t("request.guestCalled")} userDetails={userDetails?.guestCalled ? t("request.yes") : t("request.no")} />
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <Detail label={t("request.calles")} userDetails={userDetails?.noCalls == null ? 0 : userDetails?.noCalls} />
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <Detail label={t("request.followUp")} userDetails={userDetails?.followUp == null ? 0 : userDetails?.followUp} />
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
});

export default UserDetailCard;
