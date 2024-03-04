import * as React from "react";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";
import axios from "axios";
// import "./ManagesUsersList.css";
import { baseUrl } from "../../features/Api/BaseUrl";
import moment from "moment";

export default function ManagesUsersList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [searchApiData, setSearchApiData] = useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
  };
  console.log(searchApiData, rows);
  const getdataList = () => {
    axios
      .get(`${baseUrl}getAllUser`)
      .then((response) => {
        console.log(response.data.user_details);
        setRows(response.data.user_details);
        setSearchApiData(response.data.user_details);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getdataList();
  }, []);

  const cancelBooking = (id) => {
    let deleteId = id;
    axios
      .post(`${baseUrl}booking/cancel`, {
        booking_id: deleteId,
      })
      .then((responce) => {
        Swal.fire(" Booking Cancel!", "Your file has been Cancel;.", "success");
        getdataList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const filterData = (event) => {
    const newData = rows.filter((row) =>
      row.host_name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setRows(newData);
  };

  const cancelBookingList = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Booking cancel it!",
    }).then((result) => {
      if (result.value) {
        cancelBooking(id);
      }
    });
  };

  const deletOrderList = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrder(id);
      }
    });
  };

  const deleteOrder = (id) => {
    axios
      .post(`${baseUrl}booking/delete`, {
        booking_id: id,
      })
      .then((responce) => {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        getdataList();
        console.log(responce);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const approveBookingList = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, booking approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        approveBooking(id);
      }
    });
  };

  const approveBooking = (id) => {
    axios
      .post(`${baseUrl}booking/approve`, {
        booking_id: id,
      })
      .then((responce) => {
        console.log(responce);
        Swal.fire("Booking Approve!", "Your file has been deleted.", "success");
        getdataList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        deleteApi(id);
      }
    });
  };

  const deleteApi = (id) => {
    let deleteId = id;
    axios
      .delete(`${baseUrl}deleteUser/${deleteId}`)
      .then((response) => {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        getdataList();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const dataActiveInactive = (id, data) => {
    axios
      .post(`${baseUrl}checkAndToggleStatus_Of_User/${id}`)
      .then((response) => {
        console.log(response);
        console.log(response.data.success);
        if (data == 0) {
          Swal.fire("Status!", "Activate.", "success");
          getdataList();
        } else {
          Swal.fire("Status!", "Deactivate.", "success");
          getdataList();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFilter = (event) => {
    if (event.target.value === "") {
      setRows(searchApiData);
    } else {
      const filterResult = searchApiData.filter((item) => {
        const fullName = `${item.fullName}`.toLowerCase();
        const phoneNo = `${item.phone_no}`.toLowerCase();
        const searchValue = event.target.value.toLowerCase();

        // Check if the full name, phone number, or email includes the search value
        return fullName.includes(searchValue) || phoneNo.includes(searchValue);
      });
      setRows(filterResult);
    }
    setFilterValue(event.target.value);
  };

  const handleClearFilter = () => {
    setFilterValue("");
    setRows(searchApiData);
  };
  return (
    <div>
      <Paper sx={{ width: "100%", overflow: "hidden", padding: "12px" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ padding: "20px" }}
        >
          Users List
        </Typography>
        <Divider />
        <Box height={10} />
        <Stack direction="row" spacing={2} classNameName="my-2 mb-2">
          <TextField
            sx={{ width: "25%" }}
            label="Search"
            id="outlined-size-small"
            size="small"
            value={filterValue}
            onChange={(e) => handleFilter(e)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {filterValue && (
                    <IconButton onClick={handleClearFilter} edge="end">
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>{" "}
        </Stack>
        <Box height={10} />
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: "80px" }}>
                  Serial No.
                </TableCell>

                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Name
                </TableCell>

                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Mobile No.
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Profile
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  View
                </TableCell>

                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Action
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Active/Inactive
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      <TableCell align="left">{i + 1}</TableCell>

                      <TableCell align="left">
                        {row.fullName ? row.fullName : "_"}
                      </TableCell>
                      <TableCell align="left">
                        {row.phone_no ? row.phone_no : "-"}
                      </TableCell>
                      <TableCell align="left">
                        {row.profileImage ? (
                          <img
                            src={
                              "http://13.51.205.211:6002/" + row.profileImage
                            }
                            alt="loading"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            alt="loading"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {
                          <VisibilityIcon
                            onClick={() =>
                              navigate("/admin/user-detail", {
                                state: {
                                  id: row._id,
                                  response: rows,
                                },
                              })
                            }
                          />
                        }
                      </TableCell>

                      <TableCell align="left">
                        <Stack spacing={2} direction="row">
                          <DeleteIcon
                            style={{
                              fontSize: "20px",
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              deleteUser(row._id);
                            }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        {
                          <BootstrapSwitchButton
                            width={100}
                            checked={Boolean(row.user_status)}
                            onlabel="Active"
                            offlabel="Inactive"
                            onstyle="success"
                            onChange={() => {
                              dataActiveInactive(row._id, row.user_status);
                            }}
                          />
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
