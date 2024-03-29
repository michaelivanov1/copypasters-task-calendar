import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import AddTask from "./AddTask";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { DataGrid } from "@mui/x-data-grid";
import { CardHeader } from "@mui/material";
import theme from "../../theme";
import "../../App.css";
import { useAuth } from "../Auth";

const ListTasks = (props) => {
  const initialState = {
    msg: "",
    contactServer: false,
    advisories: [],
    radioButton: "",
    list: [],
    listForTable: [],
    selectedOption: "",
    isOpen: false,
    openModal: false,
    selectedId: "",
    snackBarMsg: "",
    gotData: false,
    difficulties: ["easy", "normal", "hard", "very hard", "NIGHTMARE"],
  };

  const auth = useAuth();

  const columns = [
    { field: "Subject", headerName: "Task Name", width: 200 },
    { field: "Description", headerName: "Task Description", width: 200 },
    {
      field: "priority",
      headerName: "Task Priority",
      type: "number",
      width: 130,
    },
    {
      field: "StartTime",
      headerName: "Task Due Date",
      width: 300,
      renderCell: (params) => {
        let date = new Date(params.row.StartTime);
        return date.toString();
      },
      sortComparator: (v1, v2) => v1.localeCompare(v2),
    },
    {
      field: "difficulty",
      headerName: "Task Difficulty",
      type: "number",
      width: 130,
      sortable: true,
      valueGetter: (params) =>
        `${state.difficulties[params.row.difficulty]}`,
      sortComparator: (v1, v2) => state.difficulties.indexOf(v1) - (state.difficulties.indexOf(v2)),
    },
  ];

  const sendMessageToSnackbar = (msg) => {
    props.dataFromChild(msg);
  };
  const reducer = (state, newState) => ({ ...state, ...newState });

  const [state, setState] = useReducer(reducer, initialState);

  const GRAPHURL = "http://localhost:5000/graphql";

  useEffect(() => {
    fetchTasksForUser(auth.user);
  }, []);

  const fetchTasksForUser = async (user) => {
    try {
      setState({
        contactServer: true,
      });
      sendMessageToSnackbar("Loading tasks");

      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `query {tasksforuser(username:"${user}"){_id, Subject, Description, StartTime, priority, difficulty, completed}}`,
        }),
      });
      let payload = await response.json();
      console.log(payload);
      payload.data.tasksforuser = payload.data.tasksforuser.filter(element => element.completed !== 1);
      sendMessageToSnackbar(
        `found ${payload.data.tasksforuser.length} tasks for ${user}`
      );
      setState({
        listForTable: payload.data.tasksforuser,
      });

      console.log(payload);

      return payload.data.tasksforuser;
    } catch (error) {
      console.log(error);
      sendMessageToSnackbar(`Problem loading server data - ${error.message}`);
    }
  };

  const handleClick = (params) => {
    setState({ isOpen: true, selectedId: params ? params.row._id : null });
  };

  const handleClose = () => {
    setState({ isOpen: false, openModal: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CardHeader
        title="Your Tasks"
        style={{ textAlign: "center", marginTop: 20 }}
      />
      <div style={{ height: "500px", maxHeight: "600px", width: "100%" }}>
        <DataGrid
          style={{ width: '85%', height: '75%' }}
          getRowId={(row) => row._id}
          rows={state.listForTable}
          columns={columns}
          pageSize={6}
          rowsPerPageOptions={[6]}
          onRowClick={handleClick}
        />
      </div>


      {state.isOpen && (
        <AddTask
          open={state.isOpen}
          onClose={handleClose}
          id={state.selectedId}
          dataFromChild={sendMessageToSnackbar}
        ></AddTask>
      )}
      <ControlPointIcon
        fontSize="large"
        style={{ position: "absolute", bottom: "50px", right: "50px" }}
        onClick={(e) => handleClick(null)}
        className="addicon"
      ></ControlPointIcon>
    </ThemeProvider>
  );
};
export default ListTasks;
