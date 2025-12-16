import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import Icon from "@mui/material/Icon";
import { toast } from "react-toastify";

import Tables from "../tables";
import MDButton from "../../components/MDButton";
import MDTypography from "../../components/MDTypography";
import { API_URL } from "../../../config";

const BranchesDashboard = () => {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/branches`, { withCredentials: true });
      setBranches(res?.data?.data?.docs || []);
    } catch (error) {
      toast.error("Failed to load branches");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/branches`,
        { name: name.trim(), description: description.trim() },
        { withCredentials: true },
      );
      const created = res?.data?.data?.newDoc;
      if (created) {
        setBranches((prev) => [created, ...prev]);
        toast.success("Branch created");
        setOpenModal(false);
        setName("");
        setDescription("");
      }
    } catch (error) {
      toast.error("Could not create branch");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/branches/${id}`, { withCredentials: true });
      setBranches((prev) => prev.filter((b) => b._id !== id));
      toast.success("Branch deleted");
    } catch (error) {
      toast.error("Could not delete branch");
    }
  };

  const columns = useMemo(
    () => [
      { id: "name", Header: "Name", accessor: "name", align: "center" },
      { id: "description", Header: "Description", accessor: "description", align: "center" },
      { id: "createdAt", Header: "Created", accessor: "createdAt", align: "center" },
      { id: "action", Header: "Action", accessor: "action", align: "center" },
    ],
    [],
  );

  const rows = useMemo(
    () =>
      branches.map((branch) => ({
        name: branch.name,
        description: branch.description || "-",
        createdAt: branch.createdAt ? new Date(branch.createdAt).toLocaleDateString() : "-",
        action: (
          <MDTypography component="span" variant="caption" color="error" fontWeight="medium">
            <Icon
              fontSize="small"
              style={{ cursor: "pointer" }}
              onClick={() => handleDelete(branch._id)}
            >
              delete
            </Icon>
          </MDTypography>
        ),
      })),
    [branches],
  );

  const loadingRows = useMemo(
    () =>
      isLoading
        ? [
            {
              name: "Loading...",
              description: "...",
              createdAt: "...",
              action: "...",
            },
          ]
        : [],
    [isLoading],
  );

  const displayRows = isLoading ? loadingRows : rows;

  return (
    <>
      <Tables tableTitle="Branches" rows={displayRows} columns={columns}>
        <IconButton onClick={() => setOpenModal(true)}>
          <Icon fontSize="large">add_box</Icon>
        </IconButton>
      </Tables>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Branch</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            minRows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MDButton color="secondary" variant="text" onClick={() => setOpenModal(false)}>
            Close
          </MDButton>
          <MDButton color="info" onClick={handleCreate}>
            Save
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BranchesDashboard;
