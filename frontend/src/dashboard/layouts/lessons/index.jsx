import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
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

const LessonsDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const teacherId = user?._id;

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    video: null,
  });

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/courses?teacher=${teacherId}`, { withCredentials: true });
      const docs = res?.data?.data?.docs || [];
      setCourses(docs);
      if (docs.length && !selectedCourse) setSelectedCourse(docs[0]._id);
    } catch (error) {
      toast.error("Failed to load courses");
    }
  };

  const fetchLessons = async (courseId) => {
    if (!courseId) return;
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/courses/${courseId}/lessons`, { withCredentials: true });
      setLessons(res?.data?.data?.docs || []);
    } catch (error) {
      toast.error("Failed to load lessons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchLessons(selectedCourse);
  }, [selectedCourse]);

  const handleChangeForm = (key) => (event) => {
    const value = key === "video" ? event.target.files?.[0] : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateLesson = async () => {
    if (!selectedCourse || !form.name || !form.description || !form.video) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("description", form.description);
      payload.append("video", form.video);
      payload.append("course", selectedCourse);

      await axios.post(`${API_URL}/courses/${selectedCourse}/lessons`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Lesson added");
      setOpenModal(false);
      setForm({ name: "", description: "", video: null });
      fetchLessons(selectedCourse);
    } catch (error) {
      toast.error("Could not create lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await axios.delete(`${API_URL}/courses/${selectedCourse}/lessons/${lessonId}`, {
        withCredentials: true,
      });
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      toast.success("Lesson deleted");
    } catch (error) {
      toast.error("Could not delete lesson");
    }
  };

  const columns = useMemo(
    () => [
      { id: "name", Header: "Name", accessor: "name", align: "center" },
      { id: "description", Header: "Description", accessor: "description", align: "center" },
      { id: "duration", Header: "Duration (min)", accessor: "duration", align: "center" },
      { id: "createdAt", Header: "Created", accessor: "createdAt", align: "center" },
      { id: "action", Header: "Action", accessor: "action", align: "center" },
    ],
    [],
  );

  const rows = useMemo(
    () =>
      lessons.map((lesson) => ({
        name: lesson.name,
        description: lesson.description,
        duration: lesson.duration ? Math.round(lesson.duration / 60) : "-",
        createdAt: lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : "-",
        action: (
          <MDTypography component="span" variant="caption" color="error" fontWeight="medium">
            <Icon
              fontSize="small"
              style={{ cursor: "pointer" }}
              onClick={() => handleDeleteLesson(lesson._id)}
            >
              delete
            </Icon>
          </MDTypography>
        ),
      })),
    [lessons],
  );

  const loadingRows = useMemo(
    () =>
      isLoading
        ? [
            {
              name: "Loading...",
              description: "...",
              duration: "...",
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
      <MDBox px={3} pb={1} display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="course-select-label">Course</InputLabel>
          <Select
            labelId="course-select-label"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            input={<OutlinedInput label="Course" />}
          >
            {courses.map((course) => (
              <MenuItem key={course._id} value={course._id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <MDButton
          color="info"
          disabled={!selectedCourse}
          onClick={() => setOpenModal(true)}
          startIcon={<Icon>add</Icon>}
        >
          Add Lesson
        </MDButton>
      </MDBox>

      <Tables tableTitle="Lessons" rows={displayRows} columns={columns} />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
        <DialogTitle>Add Lesson</DialogTitle>
        <DialogContent>
          <MDBox display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2} my={1}>
            <TextField
              label="Name"
              value={form.name}
              onChange={handleChangeForm("name")}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={handleChangeForm("description")}
              fullWidth
              multiline
              minRows={2}
              required
            />
            <TextField
              label="Video"
              type="file"
              inputProps={{ accept: "video/*" }}
              onChange={handleChangeForm("video")}
              fullWidth
              required
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton color="secondary" variant="text" onClick={() => setOpenModal(false)}>
            Close
          </MDButton>
          <MDButton color="info" onClick={handleCreateLesson} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create"}
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LessonsDashboard;
