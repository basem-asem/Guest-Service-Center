import {
  CardHeader,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { AccountEyeOutline, Eye } from "mdi-material-ui";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import useTranslation from "src/@core/hooks/useTranslation";

const statusObj = {
  Accepted: { color: "info" },
  Cancelled: { color: "error" },
  Pending: { color: "warning" },
  Completed: { color: "success" },
};

function UserOrderList(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { UserOrderList } = props;
  const router = useRouter();
  const { t } = useTranslation(router?.locale);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <div>
      <CardHeader
        title={t("user.userorder.title")}
        titleTypographyProps={{ variant: "h6", align: "center" }}
      />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ textAlignLast: "center" }}>
                <TableCell>{t("user.userorder.date")}</TableCell>
                <TableCell>{t("user.quantity")}</TableCell>
                <TableCell>{t("user.userorder.totalprice")}</TableCell>
                <TableCell>{t("user.userorder.status")}</TableCell>
                <TableCell>{t("user.userorder.viewdetail")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {UserOrderList?.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ).length !== 0 ? (
                UserOrderList?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ).map((item, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                      sx={{ textAlignLast: "center" }}
                    >
                      <TableCell>
                      {item.created_at &&
                              router?.locale == "ar" ? new Date(
                                item.created_at.seconds * 1000
                                ).toDateString().replace('Sat', 'السبت').replace('Sun', 'الاحد').replace('Mon', 'الاثنين').replace('Tue', 'الثلاثاء').replace('Wed', 'الاربعاء').replace('Thu', 'الخميس').replace('Fri', 'الجمعة')
                                .replace('Jan', 'يناير').replace('Feb', 'فبراير').replace('Mar', 'مارس').replace('Apr', 'ابريل').replace('May', 'مايو').replace('Jun', 'يونيو').replace('Jul', 'يوليو').replace('Aug', 'اغسطس').replace('Sept', 'سبتمبر').replace('Nov', 'نوفمبر').replace('Oct', 'اكتوبر').replace('Dec', 'ديسمبر') : new Date(
                                  item.created_at.seconds * 1000
                                  ).toDateString()
                                }
                      </TableCell>
                      <TableCell>{item.itemsQuantity}</TableCell>
                      <TableCell>{item.finalPrice}</TableCell>
                      <TableCell>
                        <Chip
                          label={router.locale == "en"? item?.status: item?.status.replaceAll('Pending', 'معلق').replaceAll('Accepted', 'مقبولة').replaceAll('On its way', 'في الطريق اليك').replaceAll('Delivered', 'تم التوصيل').replaceAll('Completed', 'اكتمل').replaceAll('Canceled', 'ملغاة')}
                          color={statusObj[item && item?.status]?.color}
                          sx={{
                            height: 24,
                            fontSize: "0.75rem",
                            textTransform: "capitalize",
                            "& .MuiChip-label": { fontWeight: 500 },
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button>
                          <Link
                            href={{
                              pathname: `/orderDetail/${item.id}`,
                            }}
                          >
                            <Eye titleAccess="View User" htmlColor="blue" />
                          </Link>
                        </Button>
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
        {UserOrderList.length !== 0 && (
          <TablePagination
            labelRowsPerPage={t("table.rowperpage")}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={UserOrderList?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </div>
  );
}

export default UserOrderList;
