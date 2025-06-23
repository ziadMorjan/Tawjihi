//react
import { useEffect, useState } from "react";

//components
import { Card } from "../../components/card/courseCard";

//axios
import axios from "axios";
//URL
import { API_URL } from "../../config";
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
//MUI library

//toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/Buttons/button";

const MyCourses = () => {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${API_URL}/enrollments?user=${userId}`, {
          withCredentials: true,
        });

        if (res) {
          console.log(res.data.data.docs, "res");
          setMyCourses(res.data.data.docs);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, []);

  return (
    <div>
      <ToastContainer />

      <LogoAndButton />
      <NavBar />
      <h2 style={{ textAlign: "center", margin: "16px" }}>قائمة دوراتي</h2>

      {myCourses.length === 0 ? (
        <p style={{ textAlign: "center" }}>لا توجد عناصر.</p>
      ) : (
        <div
          className="myCourses-grid"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {myCourses?.map((item) => (
            <Card
              key={item.course._id}
              item={item.course}
              id={item.course._id}
              imgSrc={item.course.img || "/assets/img/logo.png"}
              name={item.course.name}
              starIcon={item.course.averageRating}
              price={item.course.price}
              priceAfterDiscount={item.course.priceAfterDiscount}
              teacherName={item.course.teacher?.name}
              teacherImg={item.course.teacher?.img || "/assets/img/logo.png"}
              branch={item.course.branches.map((b) => b.name).join(" | ")}
              subject={item.course.subject?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
