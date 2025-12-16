import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import { toast } from "react-toastify";

import Tables from "../tables";
import MDBox from "../../components/MDBox";
import MDButton from "../../components/MDButton";
import MDTypography from "../../components/MDTypography";
import { API_URL } from "../../../config";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  priceAfterDiscount: "",
  subject: "",
  branches: [],
  coverImage: null,
  teacher: "",
};

const CoursesDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [formState, setFormState] = useState(initialFormState);

  const fetchLookups = async () => {
    try {
      const [branchesRes, subjectsRes] = await Promise.all([
        axios.get(`${API_URL}/branches`),
        axios.get(`${API_URL}/subjects`),
      ]);

      setBranches(branchesRes?.data?.data?.docs || []);
      setSubjects(subjectsRes?.data?.data?.docs || []);
    } catch (error) {
      toast.error("Failed to load branches or subjects");
    }
  };

  const fetchTeachers = async () => {
    if (!isAdmin) return;
    try {
      const res = await axios.get(`${API_URL}/users?role=teacher&isActive=true`, {
        withCredentials: true,
      });
      setTeachers(res?.data?.data?.docs || []);
    } catch (error) {
      toast.error("Failed to load teachers");
    }
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const teacherQuery = isTeacher && user?._id ? `?teacher=${user._id}` : "";
      const res = await axios.get(`${API_URL}/courses${teacherQuery}`, {
        withCredentials: true,
      });
      setCourses(res?.data?.data?.docs || []);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLookups();
    fetchTeachers();
    fetchCourses();
  }, []);

  const handleChange = (key) => (event) => {
    const value = key === "coverImage" ? event.target.files?.[0] : event.target.value;
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

  const handleCreateCourse = async () => {
    if (!formState.name || !formState.subject || !formState.branches.length || !formState.price) {
      toast.error("Please fill the required fields");
      return;
    }

    const teacherId = isAdmin ? formState.teacher : user?._id;
    if (!teacherId) {
      toast.error("Teacher is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("name", formState.name);
      if (formState.description.trim()) {
        payload.append("description", formState.description.trim());
      }
      payload.append("price", Number(formState.price));
      if (formState.priceAfterDiscount) {
        payload.append("priceAfterDiscount", Number(formState.priceAfterDiscount));
      }
      payload.append("subject", formState.subject);
      formState.branches.forEach((branchId) => payload.append("branches", branchId));
      payload.append("teacher", teacherId);
      if (formState.coverImage) payload.append("coverImage", formState.coverImage);

      const res = await axios.post(`${API_URL}/courses`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const created = res?.data?.data?.newDoc;
      if (created) {
        await fetchCourses();
        toast.success("Course created");
        setOpenModal(false);
        resetForm();
      }
    } catch (error) {
      toast.error("Could not create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`${API_URL}/courses/${courseId}`, { withCredentials: true });
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      toast.success("Course removed");
    } catch (error) {
      toast.error("Could not delete course");
    }
  };

  const columns = useMemo(() => {
    const cols = [
      { id: "name", Header: "Name", accessor: "name", align: "center" },
      { id: "subject", Header: "Subject", accessor: "subject", align: "center" },
      { id: "branches", Header: "Branches", accessor: "branches", align: "center" },
      { id: "price", Header: "Price", accessor: "price", align: "center" },
      { id: "discount", Header: "Discounted Price", accessor: "discount", align: "center" },
    ];

    if (!isTeacher) {
      cols.splice(2, 0, { id: "teacher", Header: "Teacher", accessor: "teacher", align: "center" });
    }

    cols.push(
      { id: "createdAt", Header: "Created", accessor: "createdAt", align: "center" },
      { id: "action", Header: "Action", accessor: "action", align: "center" },
    );

    return cols;
  }, [isTeacher]);

  const rows = useMemo(() => {
    return courses.map((course) => ({
      name: course.name,
      subject: course.subject?.name || "-",
      branches: Array.isArray(course.branches)
        ? course.branches.map((branch) => branch?.name).filter(Boolean).join(", ")
        : "-",
      teacher: course.teacher?.name || "-",
      price: `$${course.price ?? 0}`,
      discount: course.priceAfterDiscount ? `$${course.priceAfterDiscount}` : "-",
      createdAt: course.createdAt ? new Date(course.createdAt).toLocaleDateString() : "-",
      action: (
        <MDTypography component="span" variant="caption" color="error" fontWeight="medium">
          <Icon
            fontSize="small"
            style={{ cursor: "pointer" }}
            onClick={() => handleDeleteCourse(course._id)}
          >
            delete
          </Icon>
        </MDTypography>
      ),
    }));
  }, [courses]);

  const loadingRows = useMemo(
    () =>
      isLoading
        ? [
            {
              name: "Loading...",
              subject: "...",
              branches: "...",
              teacher: "...",
              price: "...",
              discount: "...",
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
      <Tables tableTitle="Courses" rows={displayRows} columns={columns}>
        {(isTeacher || isAdmin) && (
          <Icon fontSize="large" style={{ cursor: "pointer" }} onClick={() => setOpenModal(true)}>
            add_box
          </Icon>
        )}
      </Tables>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
        <DialogTitle>Add a new course</DialogTitle>
        <DialogContent>
          <MDBox display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2} my={1}>
            <TextField
              label="Name"
              value={formState.name}
              onChange={handleChange("name")}
              fullWidth
              required
            />
            <TextField
              label="Price"
              type="number"
              value={formState.price}
              onChange={handleChange("price")}
              fullWidth
              required
            />
            <TextField
              label="Discounted price"
              type="number"
              value={formState.priceAfterDiscount}
              onChange={handleChange("priceAfterDiscount")}
              fullWidth
            />
            {isAdmin && (
              <FormControl fullWidth>
                <InputLabel id="teacher-label">Teacher</InputLabel>
                <Select
                  labelId="teacher-label"
                  value={formState.teacher}
                  onChange={handleChange("teacher")}
                  input={<OutlinedInput label="Teacher" />}
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl fullWidth>
              <InputLabel id="subject-label">Subject</InputLabel>
              <Select
                labelId="subject-label"
                value={formState.subject}
                onChange={handleChange("subject")}
                input={<OutlinedInput label="Subject" />}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject._id} value={subject._id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="branches-label">Branches</InputLabel>
              <Select
                multiple
                labelId="branches-label"
                value={formState.branches}
                onChange={handleChange("branches")}
                input={<OutlinedInput label="Branches" />}
                renderValue={(selected) =>
                  branches
                    .filter((branch) => selected.includes(branch._id))
                    .map((branch) => branch.name)
                    .join(", ")
                }
              >
                {branches.map((branch) => (
                  <MenuItem key={branch._id} value={branch._id}>
                    <Checkbox checked={formState.branches.indexOf(branch._id) > -1} />
                    <ListItemText primary={branch.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description"
              value={formState.description}
              onChange={handleChange("description")}
              fullWidth
              multiline
              minRows={3}
            />
            <TextField
              label="Cover image"
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleChange("coverImage")}
              fullWidth
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton color="secondary" variant="text" onClick={() => setOpenModal(false)}>
            Close
          </MDButton>
          <MDButton color="info" onClick={handleCreateCourse} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create"}
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CoursesDashboard;
