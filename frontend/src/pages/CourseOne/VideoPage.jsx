import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import { H2 } from "../../components/typography";
import { LogoAndButton } from "../../components/LogoAndButton";
import { ModalTeacher } from "../../components/modalTeacher";
import AnimatedList from "../../components/Animations/AnimatedList";
import VideoPlayerWithControls from "../../components/VideoPlayerWithControls";
import ReviewListSection from "../../components/ReviewListSection";
import CommentForm from "../../components/CommentForm";
import { Containers } from "../../components/Container";
import VideoResources from "../../components/VideoResources";

import { NavBar } from "../../layout/navBar";

import {
  ListContainer,
  PlayerContainer,
  VideoWrapper,
  ReviewSection,
} from "./style";
import NoVideos from "../../components/NoVideos";
import { API_URL } from "../../config";
import axios from "axios";
import Loading from "../../components/Loading";

const VideoPage = () => {

  // States
  const [enrollmentCourses, setEnrollmentCourses] = useState([]);
  const [isloading, setIsloading] = useState(false);


  const { name, id, videoIndex } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const items = Array.isArray(state?.items) ? state.items : [];
  const currentIndex =
    Number(videoIndex) >= 0 && items[videoIndex] ? Number(videoIndex) : 0;
  const selectedVideo = items[currentIndex] || {};

  console.log(selectedVideo.resources);
  const handleVideoSelect = (item, index) => {
    navigate(`/courses/${name}/${id}/video/${index}`, { state: { items } });
  };

  useEffect(() => {
    if (!items.length) return;

    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        const next = (currentIndex + 1) % items.length;
        handleVideoSelect(items[next], next);
      } else if (e.key === "ArrowLeft") {
        const prev = (currentIndex - 1 + items.length) % items.length;
        handleVideoSelect(items[prev], prev);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, items]);



  // Fetch enrolled courses
  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        setIsloading(true);

        const userData = JSON.parse(localStorage.getItem("user"));
        const enrollmentsRes = await axios.get(
          `${API_URL}/enrollments?user=${userData._id}`,
          {
            withCredentials: true,
          }
        );
        if (enrollmentsRes) {
          setEnrollmentCourses(enrollmentsRes.data.data.docs);
        }
      }
      catch (e) {
        console.error("Error fetching enrolled courses:", e);
      }
      finally {
        setIsloading(false);
      }
    }

    getEnrolledCourses()
  }, [])


  // check if the user is enrolled in the course
  const isEnrolled = enrollmentCourses.some(
    (enrolled) => enrolled?.course._id === id
  );


  return (
    <>
      <LogoAndButton />
      <NavBar />
      <ModalTeacher />
      <Containers>




        {isloading ? (<Loading />
        ) : (isEnrolled ? (
          items.length > 0 ? (
            <>
              <VideoWrapper>
                <PlayerContainer>
                  <VideoPlayerWithControls
                    video={selectedVideo}
                    currentIndex={currentIndex}
                    items={items}
                    onVideoSelect={handleVideoSelect}
                  />
                  <VideoResources resources={selectedVideo.resources} />
                </PlayerContainer>

                <ListContainer>
                  <AnimatedList
                    items={items}
                    onItemSelect={handleVideoSelect}
                    selectedIndex={currentIndex}
                    showGradients
                    enableArrowNavigation
                    displayScrollbar
                  />
                </ListContainer>
              </VideoWrapper>

              <ReviewSection>
                <ReviewListSection />
                <CommentForm />
              </ReviewSection>
            </>
          ) : (
            <NoVideos>لا توجد فيديوهات لعرضها</NoVideos>
          )

        ) : (
          <NoVideos>
            لا يمكنك مشاهدة هذا الفيديو، لأنك لم تشترك في هذه الدورة
          </NoVideos>
        )
        )}
      </Containers>
    </>
  );
};

export default VideoPage;
